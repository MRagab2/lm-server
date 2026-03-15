const prisma = require("../../utils/prisma");
const AppError = require("../../utils/errors");

/**
 * Get all borrowers
 */
const getAllBorrowers = async () => {
  return await prisma.borrower.findMany({
    where: { deletedAt: null },
    orderBy: { registeredDate: "desc" },
  });
};

/**
 * Get a single borrower
 */
const getBorrowerById = async (id) => {
  const borrower = await prisma.borrower.findFirst({
    where: { id, deletedAt: null },
  });
  if (!borrower) throw new AppError("Borrower not found", 404);
  return borrower;
};

/**
 * Register a new borrower
 */
const createBorrower = async ({ name, email }) => {
  // Check email uniqueness
  const existing = await prisma.borrower.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing)
    throw new AppError("A borrower with this email already exists", 409);

  return await prisma.borrower.create({
    data: { name, email },
  });
};

/**
 * Update a borrower's details
 */
const updateBorrower = async (id, data) => {
  // Make sure borrower exists
  await getBorrowerById(id);

  // If email is being changed, check it's not already taken
  if (data.email) {
    const existing = await prisma.borrower.findFirst({
      where: { email: data.email, deletedAt: null, NOT: { id } },
    });
    if (existing)
      throw new AppError("A borrower with this email already exists", 409);
  }

  return await prisma.borrower.update({
    where: { id },
    data,
  });
};

/**
 * Soft delete a borrower
 */
const deleteBorrower = async (id) => {
  await getBorrowerById(id);

  return await prisma.borrower.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = {
  getAllBorrowers,
  getBorrowerById,
  createBorrower,
  updateBorrower,
  deleteBorrower,
};
