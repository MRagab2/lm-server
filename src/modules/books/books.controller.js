const { validationResult } = require("express-validator");
const booksService = require("./books.service");
const { sendSuccess, sendError } = require("../../utils/response");

const getAllBooks = async (req, res) => {
  try {
    const books = await booksService.getAllBooks();
    return sendSuccess(res, books, "Books retrieved successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const searchBooks = async (req, res) => {
  try {
    const books = await booksService.searchBooks(req.query.q);
    return sendSuccess(res, books, "Search results retrieved");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await booksService.getBookById(Number(req.params.id));
    return sendSuccess(res, book, "Book retrieved successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};


const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const book = await booksService.createBook(req.body);
    return sendSuccess(res, book, "Book created successfully", 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const book = await booksService.updateBook(Number(req.params.id), req.body);
    return sendSuccess(res, book, "Book updated successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const deleteBook = async (req, res) => {
  try {
    await booksService.deleteBook(Number(req.params.id));
    return sendSuccess(res, null, "Book deleted successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
