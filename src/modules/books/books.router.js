const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const booksController = require("./books.controller");
const { createBookValidation, updateBookValidation } = require("./books.validation");
const router = express.Router();


router.get("/",       booksController.getAllBooks);
router.get("/search", booksController.searchBooks);
router.get("/:id",    booksController.getBookById);

router.post(
  "/",
  authMiddleware,
  ...createBookValidation,
  booksController.createBook,
);
router.put(
  "/:id",
  authMiddleware,
  ...updateBookValidation,
  booksController.updateBook,
);
router.delete("/:id", authMiddleware, booksController.deleteBook);

module.exports = router;
