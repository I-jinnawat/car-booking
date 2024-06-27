const {Storage} = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: 'testfinale-423113',
  keyFilename: path.join(__dirname, './testfinale-423113-35d0aba03302.json'),
});

// Set up bucket and multer storage configuration
const bucket = storage.bucket('carbooking2');

const multerStorage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'attachment' || file.fieldname === 'image') {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Unexpected field'), false); // Reject the file
    }
  },
});

module.exports = {upload, bucket};
