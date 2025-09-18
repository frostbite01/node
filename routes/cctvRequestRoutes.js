const express = require('express');
const router = express.Router();
const cctvRequestController = require('../controllers/cctvRequestController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, cctvRequestController.createRequest);
router.get('/my-requests', authenticate, cctvRequestController.getMyRequests);

module.exports = router;