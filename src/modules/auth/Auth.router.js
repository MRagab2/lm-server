const express = require("express");
const authController = require("./Auth.controller");
const { registerValidation, loginValidation } = require("./Auth.validation");
const router = express.Router();

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
