// middlewares/uploadDocument.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // temp storage
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original name for templates
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(docx|DOCX)$/)) {
    req.fileValidationError = 'Only DOCX files are allowed!';
    return cb(new Error('Only DOCX files are allowed!'), false);
  }
  cb(null, true);
};

const uploadDocument = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB for documents
});

module.exports = uploadDocument;