const express = require('express');
const router = express.Router();
const signedDocumentController = require('../controllers/signedDocumentController');
const { authenticate } = require('../middlewares/auth');
const uploadDocument = require('../middlewares/uploadDocument');
const documentController = require('../controllers/documentController');

// Get all available templates
router.get('/templates', authenticate, documentController.getTemplates);

// Get template fields by ID (NEW)
router.get('/templates/:templateId/fields', authenticate, documentController.getTemplateFields);

// Fill template with form data by ID (NEW)
router.post('/templates/:templateId/fill', authenticate, documentController.fillTemplate);

// Upload new template
router.post('/templates/upload', authenticate, uploadDocument.single('template'), documentController.uploadTemplate);

// Delete template
router.delete('/templates/:templateId', authenticate, documentController.deleteTemplate);

// Legacy routes (for backward compatibility)
router.get('/templates/:templateName/fields-legacy', authenticate, documentController.getTemplateFields);
router.post('/templates/:templateName/fill-legacy', authenticate, documentController.fillTemplate);

// Signed document routes
router.post('/signed/upload', authenticate, uploadDocument.single('signedDocument'), signedDocumentController.uploadSignedDocument);
router.get('/signed/user', authenticate, signedDocumentController.getUserSignedDocuments);
router.get('/signed/:id', authenticate, signedDocumentController.getSignedDocument);
router.get('/signed', authenticate, signedDocumentController.getAllSignedDocuments);
router.delete('/signed/:id', authenticate, signedDocumentController.deleteSignedDocument);

module.exports = router;