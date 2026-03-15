const { body } = require("express-validator");

const createBorrowerValidation = [
  body("name").trim().escape().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
];

const updateBorrowerValidation = [
  body("name")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
];

module.exports = { createBorrowerValidation, updateBorrowerValidation };
