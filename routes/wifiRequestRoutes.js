const express = require('express');
const router = express.Router();
const wifiRequestController = require('../controllers/wifiRequestController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Create new request
router.post('/', authenticate, wifiRequestController.createRequest);

// Get all requests
router.get('/', authenticate, wifiRequestController.getAllRequests);

// Get current user's requests
router.get('/my-requests', authenticate, wifiRequestController.getMyRequests);

// Get specific user's requests (admin only)
router.get('/user/:userId', authenticate, isAdmin, wifiRequestController.getUserRequests);

// Get request by ID
router.get('/:id', authenticate, wifiRequestController.getRequestById);

module.exports = router;