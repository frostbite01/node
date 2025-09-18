const express = require('express');
const router = express.Router();
const softwareRequestController = require('../controllers/softwareRequestController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, softwareRequestController.createRequest);
router.get('/my-requests', authenticate, softwareRequestController.getMyRequests);

module.exports = router;