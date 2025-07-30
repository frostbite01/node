const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Public routes (still need authentication)
router.get('/', authenticate, formController.getForms);
router.get('/:id', authenticate, formController.getFormById);
router.get('/category/:category', authenticate, formController.getFormsByCategory);

// Admin only routes
router.post('/', authenticate, isAdmin, formController.createForm);
router.put('/:id', authenticate, isAdmin, formController.updateForm);
router.delete('/:id', authenticate, isAdmin, formController.deleteForm);

module.exports = router;