const express              = require('express');
const borrowersController  = require('./borrowers.controller');
const authMiddleware       = require('../../middlewares/auth.middleware');
const { createBorrowerValidation, updateBorrowerValidation } = require("./borrowers.validation");
const router = express.Router();

//  Public routes 
router.get('/',     borrowersController.getAllBorrowers);
router.get('/:id',  borrowersController.getBorrowerById);

//  Protected routes 
router.post('/',    authMiddleware, ...createBorrowerValidation, borrowersController.createBorrower);
router.put('/:id',  authMiddleware, ...updateBorrowerValidation, borrowersController.updateBorrower);
router.delete('/:id', authMiddleware, borrowersController.deleteBorrower);

module.exports = router;