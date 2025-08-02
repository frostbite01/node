const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Form management (admin only)
router.post('/', authenticate, isAdmin, formController.createForm);

// Comment out or remove routes that don't have handlers yet
/*
router.put('/:formId', authenticate, isAdmin, formController.updateForm);
router.delete('/:formId', authenticate, isAdmin, formController.deleteForm);
router.get('/:formId/placeholders', authenticate, formController.getFormPlaceholders);
router.get('/:formId/submissions/:submissionId', authenticate, formController.getSubmission);
router.put('/:formId/submissions/:submissionId', authenticate, formController.updateSubmission);
router.delete('/:formId/submissions/:submissionId', authenticate, formController.deleteSubmission);
*/

// Keep only implemented routes
router.get('/', authenticate, formController.getForms);
router.post('/:formId/submissions', authenticate, formController.createSubmission);

module.exports = router;