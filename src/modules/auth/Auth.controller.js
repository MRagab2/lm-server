const { validationResult } = require("express-validator");
const authService = require("./auth.service");
const { sendSuccess, sendError } = require("../../utils/response");

// POST /api/auth/register

const register = async (req, res) => {
  // Check validation errors from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    return sendSuccess(res, user, "User registered successfully", 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

// POST /api/auth/login

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, result, "Login successful");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = { register, login };
