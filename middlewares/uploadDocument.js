// middlewares/uploadDocument.js
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Debug log to verify user ID from token
    console.log('User from token:', req.user);
    console.log('User ID from token:', req.user.id);
    
    // Get user ID from JWT token
    const userId = req.user.id;
    
    // Define base paths with absolute path to avoid directory issues
    const userBase = path.join(__dirname, '../uploads/users', userId.toString());
    let uploadPath;

    // Determine specific path based on route
    if (req.path.includes('/signed')) {
      uploadPath = path.join(userBase, 'signed-documents');
    } else if (req.path.includes('/profile')) {
      uploadPath = userBase;
    } else if (req.path.includes('/images')) {
      uploadPath = path.join(userBase, 'images');
    } else {
      uploadPath = path.join(userBase, 'documents');
    }

    console.log('Creating directory at:', uploadPath);

    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    // Verify directory was created and is writable
    try {
      fs.accessSync(uploadPath, fs.constants.W_OK);
      console.log('Directory is writable:', uploadPath);
    } catch (error) {
      console.error('Directory access error:', error);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (req.path.includes('/signed')) {
    // PDF validation for signed documents
    if (!file.originalname.match(/\.(pdf|PDF)$/)) {
      req.fileValidationError = 'Only PDF files are allowed for signed documents!';
      return cb(new Error('Only PDF files are allowed for signed documents!'), false);
    }
  } else if (req.path.includes('/profile')) {
    // Image validation for profile pictures
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
      req.fileValidationError = 'Only JPG, JPEG, PNG files are allowed for profile pictures!';
      return cb(new Error('Only image files are allowed for profile pictures!'), false);
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