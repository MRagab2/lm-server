const prisma = require("../../utils/prisma");
const AppError = require("../../utils/errors");

const checkoutBook = async (borrowerId, bookId, dueDate) => {
  // Verify borrower exists
  const borrower = await prisma.borrower.findFirst({
    where: { id: borrowerId, deletedAt: null },
  });
  if (!borrower) throw new AppError("Borrower not found", 404);

  // Verify book exists
  const book = await prisma.book.findFirst({
    where: { id: bookId, deletedAt: null },
  });
  if (!book) throw new AppError("Book not found", 404);

  // Check if book has available copies
  if (book.availableQuantity < 1) {
    throw new AppError("No available copies of this book", 400);
  }

  // Check if borrower already has this book checked out
  const alreadyCheckedOut = await prisma.borrowingRecord.findFirst({
    where: { borrowerId, bookId, returnedAt: null, deletedAt: null },
  });
  if (alreadyCheckedOut) {
    throw new AppError("Borrower already has this book checked out", 400);
  }

  // Use a transaction to ensure both operations succeed or fail together
  const [record] = await prisma.$transaction([
    // Create borrowing record
    prisma.borrowingRecord.create({
      data: {
        borrowerId,
        bookId,
        dueDate: new Date(dueDate),
      },
      include: { book: true, borrower: true },
    }),
    // Decrement available quantity
    prisma.book.update({
      where: { id: bookId },
      data: { availableQuantity: { decrement: 1 } },
    }),
  ]);

  return record;
};

const returnBook = async (borrowingRecordId) => {
  // Find the active borrowing record
  const record = await prisma.borrowingRecord.findFirst({
    where: { id: borrowingRecordId, returnedAt: null, deletedAt: null },
    include: { book: true, borrower: true },
  });
  if (!record) throw new AppError("Active borrowing record not found", 404);

  // Use a transaction to mark returned and increment quantity
  const [updatedRecord] = await prisma.$transaction([
    // Mark as returned
    prisma.borrowingRecord.update({
      where: { id: borrowingRecordId },
      data: { returnedAt: new Date() },
      include: { book: true, borrower: true },
    }),
    // Increment available quantity
    prisma.book.update({
      where: { id: record.bookId },
      data: { availableQuantity: { increment: 1 } },
    }),
  ]);

  return updatedRecord;
};

const getBorrowerActiveBooks = async (borrowerId) => {
  // Verify borrower exists
  const borrower = await prisma.borrower.findFirst({
    where: { id: borrowerId, deletedAt: null },
  });
  if (!borrower) throw new AppError("Borrower not found", 404);

  return await prisma.borrowingRecord.findMany({
    where: { borrowerId, returnedAt: null, deletedAt: null },
    include: { book: true },
    orderBy: { checkedOutAt: "desc" },
  });
};

const getOverdueBooks = async () => {
  return await prisma.borrowingRecord.findMany({
    where: {
      returnedAt: null,
      deletedAt: null,
      dueDate: { lt: new Date() },
    },
    include: { book: true, borrower: true },
    orderBy: { dueDate: "asc" },
  });
};

module.exports = {
  checkoutBook,
  returnBook,
  getBorrowerActiveBooks,
  getOverdueBooks,
};
