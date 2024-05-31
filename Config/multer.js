const multer = require('multer');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Replace 'uploads/' with your desired directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer with the storage configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'attachment' || file.fieldname === 'image') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'), false);
    }
  },
});

// Export the upload middleware
module.exports = upload;
