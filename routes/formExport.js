// routes/formExport.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/formExportController');
const { authenticate } = require('../middlewares/auth');

// Export routes for each form type
router.get('/form/wifi/:id', authenticate, controller.downloadWifiForm);
router.get('/form/cctv/:id', authenticate, controller.downloadCctvForm);
router.get('/form/software/:id', authenticate, controller.downloadSoftwareForm);

module.exports = router;
