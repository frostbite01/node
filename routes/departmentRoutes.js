const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Create a new department
router.post('/', departmentController.create);

// Get all departments
router.get('/', departmentController.findAll);

// Get a department by ID
router.get('/:id', departmentController.findOne);

// Update a department by ID
router.put('/:id', departmentController.update);

// Delete a department by ID
router.delete('/:id', departmentController.delete);

module.exports = router;