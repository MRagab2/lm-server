const express = require("express");
const borrowingController = require("./borrowing.controller");
const authMiddleware = require('../../middlewares/auth.middleware');
const { checkoutValidation, returnValidation, borrowerIdValidation } = require("./borrowing.validation");
const router = express.Router();

router.post(
  "/checkout",
  authMiddleware,
  ...checkoutValidation,
  borrowingController.checkoutBook,
);
router.put(
  "/return/:id",
  authMiddleware,
  ...returnValidation,
  borrowingController.returnBook,
);
router.get(
  "/borrower/:borrowerId",
  authMiddleware,
  ...borrowerIdValidation,
  borrowingController.getBorrowerActiveBooks,
);
router.get("/overdue", authMiddleware, borrowingController.getOverdueBooks);

module.exports = router;
