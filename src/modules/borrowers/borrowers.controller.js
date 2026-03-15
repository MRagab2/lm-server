const { validationResult } = require("express-validator");
const borrowersService = require("./borrowers.service");
const { sendSuccess, sendError } = require("../../utils/response");

const getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await borrowersService.getAllBorrowers();
    return sendSuccess(res, borrowers, "Borrowers retrieved successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const getBorrowerById = async (req, res) => {
  try {
    const borrower = await borrowersService.getBorrowerById(
      Number(req.params.id),
    );
    return sendSuccess(res, borrower, "Borrower retrieved successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const createBorrower = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const borrower = await borrowersService.createBorrower(req.body);
    return sendSuccess(res, borrower, "Borrower registered successfully", 201);
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const updateBorrower = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400);
  }

  try {
    const borrower = await borrowersService.updateBorrower(
      Number(req.params.id),
      req.body,
    );
    return sendSuccess(res, borrower, "Borrower updated successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

const deleteBorrower = async (req, res) => {
  try {
    await borrowersService.deleteBorrower(Number(req.params.id));
    return sendSuccess(res, null, "Borrower deleted successfully");
  } catch (err) {
    return sendError(res, err.message, err.status || 500);
  }
};

module.exports = {
  getAllBorrowers,
  getBorrowerById,
  createBorrower,
  updateBorrower,
  deleteBorrower,
};
