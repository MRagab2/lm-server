const express = require("express");
const authController = require("./auth.controller");
const { registerValidation, loginValidation } = require("./auth.validation");
const { authLimiter } = require('../../middlewares/rateLimiter.middleware');
const router = express.Router();

router.post("/register", authLimiter, ...registerValidation, authController.register);
router.post("/login", authLimiter, ...loginValidation, authController.login);

module.exports = router;
