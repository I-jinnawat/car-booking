const Document = require('../Models/document');

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
    res.render('document', {
      documents,
      userLoggedIn: !!req.session.user,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal server error'});
  }
};

exports.create = async (req, res) => {
  try {
    const {category, title, link, adminName, numberID, organization, role} =
      req.body;
    const event = await Document.create({
      category,
      title,
      link,
      adminName,
      numberID,
      organization,
      role,
    });

    res.status(201).redirect('/document');
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
