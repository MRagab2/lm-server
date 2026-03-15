const { body } = require("express-validator");

const createBorrowerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required'),
];

const updateBorrowerValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email is required'),
];

module.exports = { createBorrowerValidation, updateBorrowerValidation };
