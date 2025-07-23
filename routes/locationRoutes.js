const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// Create a new location
router.post('/', locationController.create);

// Get all locations
router.get('/', locationController.findAll);

// Get a location by ID
router.get('/:id', locationController.findOne);

// Update a location by ID
router.put('/:id', locationController.update);

// Delete a location by ID
router.delete('/:id', locationController.delete);

// Get all departments and locations
router.get('/all', locationController.getAllDepartmentsAndLocations);

module.exports = router;