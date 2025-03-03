const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin, isUser } = require('../middlewares/auth');

// Admin routes
router.get('/', authenticate, isAdmin, userController.getAllUsers);
router.get('/employees', authenticate, isUser, userController.getEmployees);
router.post('/employees', authenticate, isAdmin, userController.createEmployee);
router.get('/:id', authenticate, isUser, userController.getUserById);
router.put('/:id', authenticate, isAdmin, userController.updateUser);
router.delete('/:id', authenticate, isAdmin, userController.deleteUser);

module.exports = router; 