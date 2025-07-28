const express = require('express');
const router = express.Router();
const signedDocumentController = require('../controllers/signedDocumentController');
const { authenticate } = require('../middlewares/auth');
const uploadDocument = require('../middlewares/uploadDocument');
const documentController = require('../controllers/documentController'); // Fixed casing

// Get all available templates
router.get('/templates', authenticate, documentController.getTemplates);

// Get template fields/placeholders
router.get('/templates/:templateName/fields', authenticate, documentController.getTemplateFields);

// Fill template with form data
router.post('/templates/:templateName/fill', authenticate, documentController.fillTemplate);

// Upload new template
router.post('/templates/upload', authenticate, uploadDocument.single('template'), documentController.uploadTemplate);


// Signed document routes
router.post('/signed/upload', authenticate, uploadDocument.single('signedDocument'), signedDocumentController.uploadSignedDocument);
router.get('/signed/user', authenticate, signedDocumentController.getUserSignedDocuments); // put this first
router.get('/signed/:id', authenticate, signedDocumentController.getSignedDocument);  // put this after
router.get('/signed', authenticate, signedDocumentController.getAllSignedDocuments);
router.delete('/signed/:id', authenticate, signedDocumentController.deleteSignedDocument);


module.exports = router;