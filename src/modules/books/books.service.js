const prisma = require("../../utils/prisma");
const AppError = require("../../utils/errors");

/**
 * Get all books
 */
const getAllBooks = async () => {
  return await prisma.book.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get a single book
 */
const getBookById = async (id) => {
  const book = await prisma.book.findFirst({
    where: { id, deletedAt: null },
  });
  if (!book) throw new AppError("Book not found", 404);
  return book;
};

/**
 * Search books by title, author, ISBN
 */
const searchBooks = async (query) => {
  if (!query) throw new AppError("Search query is required", 400);

  return await prisma.book.findMany({
    where: {
      deletedAt: null,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
        { isbn: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Add a new book
 */
const createBook = async ({
  title,
  author,
  isbn,
  availableQuantity,
  shelfLocation,
}) => {
  // Check ISBN uniqueness
  const existing = await prisma.book.findFirst({
    where: { isbn, deletedAt: null },
  });
  if (existing) throw new AppError("A book with this ISBN already exists", 409);

  return await prisma.book.create({
    data: { title, author, isbn, availableQuantity, shelfLocation },
  });
};

/**
 * Update a book's details
 */
const updateBook = async (id, data) => {
  // Make sure book exists
  await getBookById(id);

  // If ISBN is being changed, check it's not already taken
  if (data.isbn) {
    const existing = await prisma.book.findFirst({
      where: { isbn: data.isbn, deletedAt: null, NOT: { id } },
    });
    if (existing)
      throw new AppError("A book with this ISBN already exists", 409);
  }

  return await prisma.book.update({
    where: { id },
    data,
  });
};

/**
 * delete a book - soft deletion
 */
const deleteBook = async (id) => {
  await getBookById(id);

  return await prisma.book.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
};
