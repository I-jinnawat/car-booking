const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');

exports.list = async (req, res) => {
  const documents = null;
  try {
    res.render('document', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
      documents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.read = async (req, res) => {
  try {
    const category = req.params.category;
    const documents = await Document.find({category: category}).exec();
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set unique file name
  },
});

// Create multer instance
const upload = multer({storage: storage});

// Middleware to handle file upload
exports.uploadImage = upload.single('image');

// Route to handle form submission including image upload
exports.create = async (req, res) => {
  try {
    const {category, title, link, adminName, numberID, organization, role} =
      req.body;

    // Get the file path of the uploaded image
    const imagePath = req.file ? req.file.path : null;

    // Create new document entry in the database
    const document = await Document.create({
      category,
      title,
      link,
      adminName,
      numberID,
      organization,
      role,
      image: imagePath, // Save the image path in the database
    });

    res.status(201).redirect('/document');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
