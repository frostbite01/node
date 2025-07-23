const express = require('express');
const router = express.Router();
const commonController = require('../controllers/commonController');

// Get all departments and locations
router.get('/locanddept', commonController.getLocationsAndDepartments);

module.exports = router;