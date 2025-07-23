const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, isUser } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get tasks by status
router.get('/status/:status', taskController.getTasksByStatus);

// Get tasks assigned to a user
router.get('/assigned/:userId', taskController.getTasksByAssignee);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Create new task
router.post('/', taskController.createTask);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router; 