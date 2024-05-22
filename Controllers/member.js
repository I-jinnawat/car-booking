const User = require('../Models/Auth');
const bcrypt = require('bcryptjs');

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

exports.update = async (req, res) => {
  const {id} = req.params;
  const {newpassword, newfirstname, newlastname, neworganization, newrole} =
    req.body;

  try {
    let user = await User.findById(id); // Finding the user by id
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update user fields
    user.firstname = newfirstname;
    user.lastname = newlastname;
    user.organization = neworganization;
    user.role = newrole;

    // Check if new password provided and hash it
    if (newpassword) {
      user.password = bcrypt.hashSync(newpassword, 10);
    }

    await user.save();

    res.redirect('/setting/member');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.remove = async (req, res) => {
  const {id} = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting User:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
