const Manual = require('../Models/manual');
const upload = require('../Config/multer');
exports.list = async (req, res) => {
  try {
    const manuals = await Manual.find({}).lean();
    const userLoggedIn = !!req.session.user;
    res.render('edit-manual', {
      userLoggedIn,
      user: req.session.user,
      manuals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.update = async (req, res) => {
  try {
    const {id} = req.params;
    const {title, attachmentType} = req.body;

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
    const updateData = {};
    if (attachmentType === 'file' && attachment) {
      updateData.file = attachment;
      updateData.link = null;
    } else if (attachmentType === 'link' && attachment) {
      updateData.link = attachment;
      updateData.file = null;
    }
    if (title) updateData.title = title;
    const updatedManual = await Manual.findByIdAndUpdate(id, updateData, {
      new: true,
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
    await Manual.create({title});
    res.send('Successfully');
  } catch (error) {
    console.error('Error creating manual:', error);
    res.status(500).json({error: error.message});
  }
};

exports.remove = async (req, res) => {
  const {id} = req.params;
  const {attachmentType} = req.body;
  try {
    const manual = await Manual.findById(id);
    console.log(manual);
    if (!manual) {
      return res
        .status(404)
        .json({success: false, message: 'ไม่พบคู่มือการใช้งาน'});
    } else {
      console.log(manual);
    }

    if (attachmentType === 'file') {
      manual.file = null;
    } else if (attachmentType === 'link') {
      manual.link = null;
    }

    await manual.save();
    res.json({success: true});
  } catch (error) {
    res
      .status(500)
      .json({success: false, message: 'เกิดข้อผิดพลาดในการลบไฟล์หรือลิงก์'});
  }
};
