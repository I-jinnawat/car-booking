const Document = require('../Models/document');

exports.list = async (req, res) => {
  try {
    res.render('document', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
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
exports.display_edit_page = async (req, res) => {
  try {
    const id = req.params.id; // Extracting ID from req.params
    const document = await Document.findById(id); // Finding the document by ID
    if (!document) {
      return res.status(404).json({error: 'Document not found'});
    }
    res.render('edit-document', {
      document,
      userLoggedIn: true,
      user: req.session.user,
    }); // Rendering an edit page with document data
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
};

exports.create = async (req, res) => {
  try {
    const {
      category,
      title,
      adminName,
      numberID,
      organization,
      role,
      attachmentType,
    } = req.body;

    let attachment = null;
    if (attachmentType === 'file') {
      attachment = req.files['attachment']
        ? req.files['attachment'][0].path
        : null;
    } else if (attachmentType === 'link') {
      // Get the URL of the link
      attachment = req.body.attachment;
      // res.send(attachment);
    }
    const imagePath = req.files['image'] ? req.files['image'][0].path : null;

    // Create new document entry in the database
    const document = await Document.create({
      category,
      title,
      file: attachmentType === 'file' ? attachment : null,
      link: attachmentType === 'link' ? attachment : null,
      adminName,
      numberID,
      organization,
      role,
      image: imagePath,
    });

    res
      .status(201)
      .redirect(`/document?category=${encodeURIComponent(category)}`);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.display_add_page = async (req, res) => {
  try {
    res.render('add-document', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      category,
      title,
      adminName,
      numberID,
      organization,
      role,
      attachmentType,
    } = req.body;

    let attachment = null;
    if (attachmentType === 'file') {
      attachment = req.files['attachment']
        ? req.files['attachment'][0].path
        : null;
      // res.send(attachment);
    } else if (attachmentType === 'link') {
      attachment = req.body.attachment;
      // res.send(attachment);
    }

    const imagePath = req.files['image'] ? req.files['image'][0].path : null;

    const updateData = {};
    if (category) updateData.category = category;
    if (title) updateData.title = title;

    if (attachmentType === 'file' && attachment) {
      updateData.file = attachment;
      updateData.link = null;
    } else if (attachmentType === 'link' && attachment) {
      updateData.link = attachment;
      updateData.file = null;
    }

    if (adminName) updateData.adminName = adminName;
    if (numberID) updateData.numberID = numberID;
    if (organization) updateData.organization = organization;
    if (role) updateData.role = role;
    if (imagePath) updateData.image = imagePath;

    const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({error: 'Document not found'});
    }

    res.status(200).redirect('/document');
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
};

exports.remove = async (req, res) => {
  const {id} = req.params;

  try {
    await Document.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting Document:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
