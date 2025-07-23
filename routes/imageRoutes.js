const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Add upload.single('image') middleware
router.post('/upload', authenticate, upload.single('image'), imageController.uploadImage);
router.get('/:id', authenticate, imageController.getImage);
router.get('/', authenticate, imageController.getAllImages);

module.exports = router;