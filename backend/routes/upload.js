const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadController = require('../controllers/upload');
const fs = require('fs');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      console.log(`Creating upload directory: ${uploadDir}`);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log(`Using upload directory: ${uploadDir}`);
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
});

// Route for avatar upload
router.post('/avatar', upload.single('file'), uploadController.uploadAvatar);

// Route for company logo upload
router.post('/company-logo', upload.single('file'), uploadController.uploadCompanyLogo);

module.exports = router; 