// middlewares/uploadDocument.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Route-based destination
    const dest = req.path.includes('/signed') ? 'uploads/signed-documents/' : 'uploads/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    if (req.path.includes('/signed')) {
      // For signed PDFs, add timestamp
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\.[^/.]+$/, '');
      cb(null, `${originalName}_${timestamp}.pdf`);
    } else {
      // For templates, keep original name
      cb(null, file.originalname);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (req.path.includes('/signed')) {
    // PDF validation for signed documents
    if (!file.originalname.match(/\.(pdf|PDF)$/)) {
      req.fileValidationError = 'Only PDF files are allowed for signed documents!';
      return cb(new Error('Only PDF files are allowed for signed documents!'), false);
    }
  } else {
    // DOCX validation for templates
    if (!file.originalname.match(/\.(docx|DOCX)$/)) {
      req.fileValidationError = 'Only DOCX files are allowed for templates!';
      return cb(new Error('Only DOCX files are allowed for templates!'), false);
    }
  }
  cb(null, true);
};

const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = uploadDocument;