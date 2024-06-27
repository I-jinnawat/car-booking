const Document = require('../Models/document');
const {bucket} = require('../Config/multer');

exports.list = async (req, res) => {
  try {
    const documents = await Document.find();
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
    const documents = await Document.find({category});
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.display_edit_page = async (req, res) => {
  try {
    const id = req.params.id;
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({error: 'Document not found'});
    }
    res.render('edit-document', {
      document,
      userLoggedIn: true,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
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
    let publicUrl = null;
    let imagePath = null;

    // ตรวจสอบว่ามีการอัปโหลดไฟล์ attachment (เอกสาร)
    if (attachmentType === 'file' && req.files && req.files['attachment']) {
      attachment = req.files['attachment'][0];
      const originalname = attachment.originalname;
      const blob = bucket.file(`${Date.now()}-${originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true,
      });

      blobStream.on('error', err => {
        console.error(err);
        return res.status(500).json({error: 'Upload failed'});
      });

      blobStream.on('finish', async () => {
        // ตั้งค่า ACL เป็น publicRead
        await blob.makePublic();

        publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        console.log('Document URL:', publicUrl);

        // บันทึกข้อมูลเอกสารที่มีไฟล์
        const document = await Document.create({
          category,
          title,
          file: publicUrl,
          link: null, // ตั้งค่า link เป็น null
          adminName,
          numberID,
          organization,
          role,
          image: imagePath, // เพิ่มฟิลด์ image
        });

        res.status(201).redirect('/document');
      });

      blobStream.end(attachment.buffer);
    } else if (attachmentType === 'link') {
      attachment = req.body.attachment;

      // บันทึกข้อมูลเอกสารที่มีลิงก์
      const document = await Document.create({
        category,
        title,
        link: attachment,
        file: null, // ตั้งค่า file เป็น null
        adminName,
        numberID,
        organization,
        role,
        image: imagePath, // เพิ่มฟิลด์ image
      });

      res.status(201).redirect('/document');
    } else {
      res.status(400).json({error: 'Invalid attachment type'});
    }

    // ตรวจสอบว่ามีการอัปโหลดรูปภาพ
    if (req.files && req.files['image']) {
      const image = req.files['image'][0];
      const imageBlob = bucket.file(`${Date.now()}-${image.originalname}`);
      const imageBlobStream = imageBlob.createWriteStream({
        resumable: false,
        gzip: true,
      });

      imageBlobStream.on('error', err => {
        console.error(err);
        return res.status(500).json({error: 'Upload failed'});
      });

      imageBlobStream.on('finish', async () => {
        // ตั้งค่า ACL เป็น publicRead
        await imageBlob.makePublic();

        imagePath = `https://storage.googleapis.com/${bucket.name}/${imageBlob.name}`;
        console.log('Image URL:', imagePath);

        // ถ้าเอกสารไม่มีไฟล์ (attachmentType !== 'file') ให้บันทึกข้อมูลเอกสารด้วยภาพ
        if (attachmentType !== 'file') {
          const document = await Document.create({
            category,
            title,
            file: null,
            link: attachmentType === 'link' ? attachment : null,
            adminName,
            numberID,
            organization,
            role,
            image: imagePath,
          });

          res.status(201).redirect('/document');
        }
      });

      imageBlobStream.end(image.buffer);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
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
    let imagePath = null;

    if (attachmentType === 'file' && req.files && req.files['attachment']) {
      attachment = req.files['attachment'][0].path;
    } else if (attachmentType === 'link') {
      attachment = req.body.attachment;
    }

    if (req.files && req.files['image']) {
      imagePath = req.files['image'][0].path;
    }

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
    res.status(500).json({error: 'Internal Server Error'});
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
