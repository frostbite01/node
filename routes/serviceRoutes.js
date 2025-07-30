// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middlewares/auth');

// Create a new service type
router.post('/types', authenticate, serviceController.createServiceType);

module.exports = router;