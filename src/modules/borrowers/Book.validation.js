const { body } = require("express-validator");

const createBookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),
  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required"),
  body("isbn")
    .trim()
    .notEmpty()
    .withMessage("ISBN is required"),
  body("availableQuantity")
    .isInt({ min: 0 })
    .withMessage("Available quantity must be a non-negative integer"),
  body("shelfLocation")
    .trim()
    .notEmpty()
    .withMessage("Shelf location is required"),
];

const updateBookValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("author")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Author cannot be empty"),
];

module.exports = { createBookValidation, updateBookValidation };
