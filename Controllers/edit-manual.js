const Manual = require('../Models/manual');
const upload = require('../Config/multer');
exports.list = async (req, res) => {
  try {
    const manuals = await Manual.find({}).lean();

    if (req.session.user) {
      res.render('edit-manual', {
        userLoggedIn: true,
        user: req.session.user,
        manuals: manuals, // Use `manuals` instead of `manual` for clarity
      });
    } else {
      res.render('edit-manual', {
        userLoggedIn: false,
        manuals: manuals, // Include manuals even if the user is not logged in
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.uploadImage = upload.single('image');
exports.uploadFile = upload.single('file');

exports.update = async (req, res) => {
  try {
    const {id} = req.params;
    const {title} = req.body;

    // Check if the 'file' field exists in the request
    const linkPath = req.files['link'] ? req.files['link'][0].path : null;

    // Find the manual by ID and update it
    const updatedManual = await Manual.findByIdAndUpdate(id, {
      title,
      file: linkPath,
    });

    if (!updatedManual) {
      return res.status(404).json({error: 'Manual not found'});
    }

    res.redirect('/setting/edit-manual');
  } catch (error) {
    console.error('Error updating manual:', error);
    res.status(500).json({error: error.message});
  }
};

exports.create = async (req, res) => {
  try {
    const {title} = req.body;
    // Get the file paths of the uploaded files
    const filePath = req.files['file'] ? req.files['file'][0].path : null;

    await Manual.create({title, file: filePath});

    res.send('Successfully');
  } catch (error) {
    console.error('Error creating manual:', error);
    res.status(500).json({error: error.message});
  }
};
