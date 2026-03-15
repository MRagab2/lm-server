const { body } = require("express-validator");

const registerValidation = [
  body("name").trim().escape().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Valid email is required")
    .toLowerCase(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .toLowerCase(),
];

module.exports = { registerValidation, loginValidation };
