const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticate } = require('../middlewares/auth');
const uploadDocument = require('../middlewares/uploadDocument');
// Get all available templates
router.get('/templates', authenticate, documentController.getTemplates);

// Get template fields/placeholders
router.get('/templates/:templateName/fields', authenticate, documentController.getTemplateFields);

// Fill template with form data
router.post('/templates/:templateName/fill', authenticate, documentController.fillTemplate);

// Upload new template
router.post('/templates/upload', authenticate, uploadDocument.single('template'), documentController.uploadTemplate);
module.exports = router;