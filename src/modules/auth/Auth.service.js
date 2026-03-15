const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../utils/prisma");
const AppError = require("../../utils/errors");

// Register a new user

const register = async (name, email, password) => {
  // Check if email already exists
  const existing = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { id: user.id, name: user.name, email: user.email };
};

// Login

const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare provided password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Sign and return a JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  return { token, user: { id: user.id, name: user.name, email: user.email } };
};

module.exports = { register, login };
