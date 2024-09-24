const multer = require('multer');const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const utf8Filename = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    );
    cb(null, `${Date.now()}-${utf8Filename}`);
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
