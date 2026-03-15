const { body } = require("express-validator");

const createBookValidation = [
  body("title")
    .trim()
    .escape()
    .notEmpty().withMessage("Title is required"),
  body("author")
    .trim()
    .escape()
    .notEmpty().withMessage("Author is required"),
  body("isbn")
    .trim()
    .escape()
    .notEmpty().withMessage("ISBN is required"),
  body("availableQuantity")
    .isInt({ min: 0 })
    .withMessage("Available quantity must be a non-negative integer"),
  body("shelfLocation")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Shelf location is required"),
];

const updateBookValidation = [
  body("title")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Title cannot be empty"),
  body("author")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Author cannot be empty"),
  body("isbn")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("ISBN cannot be empty"),
  body("availableQuantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Available quantity must be a non-negative integer"),
  body("shelfLocation")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Shelf location cannot be empty"),
];

module.exports = { createBookValidation, updateBookValidation };
