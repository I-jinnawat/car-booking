const User = require('../Models/Auth');

exports.read = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find().skip(skip).limit(limit).lean();
    const data = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      totalPages: totalPages,
      currentPage: parseInt(page),
    };
    if (req.session.user) {
      res.render('member', data);
    } else {
      res.render('dashboard', {
        userLoggedIn: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
