const multer = require('multer');

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
      cb(null, true); // No error, accept the file
    } else {
      cb(new Error('Unexpected field'), false); // Error, reject the file
    }
  },
});

// Export the upload middleware
module.exports = upload;
