const { body, param } = require("express-validator");

const checkoutValidation = [
  body("borrowerId")
    .isInt({ min: 1 }).withMessage("Valid borrower ID is required"),
  body("bookId")
    .isInt({ min: 1 }).withMessage("Valid book ID is required"),
  body("dueDate")
    .isISO8601().withMessage("Valid due date is required (YYYY-MM-DD)")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),
];

const returnValidation = [
  param("id")
    .isInt({ min: 1 }).withMessage("Valid borrowing record ID is required"),
];

const borrowerIdValidation = [
  param("borrowerId")
    .isInt({ min: 1 }).withMessage("Valid borrower ID is required"),
];

module.exports = { checkoutValidation, returnValidation, borrowerIdValidation };
