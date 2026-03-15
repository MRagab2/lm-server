const { validationResult } = require("express-validator");
const borrowingService = require("./borrowing.service");
const { sendSuccess, sendError } = require("../../utils/response");

const checkoutBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const { borrowerId, bookId, dueDate } = req.body;
    const record = await borrowingService.checkoutBook(
      Number(borrowerId),
      Number(bookId),
      dueDate,
    );
    return sendSuccess(res, record, "Book checked out successfully", 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const returnBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const record = await borrowingService.returnBook(Number(req.params.id));
    return sendSuccess(res, record, "Book returned successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getBorrowerActiveBooks = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const records = await borrowingService.getBorrowerActiveBooks(
      Number(req.params.borrowerId),
    );
    return sendSuccess(
      res,
      records,
      "Active borrowings retrieved successfully",
    );
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const records = await borrowingService.getOverdueBooks();
    return sendSuccess(res, records, "Overdue books retrieved successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = {
  checkoutBook,
  returnBook,
  getBorrowerActiveBooks,
  getOverdueBooks,
};
