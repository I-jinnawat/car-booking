const User = require('../Models/Auth');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;

    // Find user by username
    const user = await User.findOne({username});

    if (!user) {
      // If user not found, render login with error
      return res.render('login', {
        error: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง',
        username: username || '',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If password is not valid, render login with error
      return res.render('login', {
        error: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง',
        username: username,
      });
    }

    // If password is valid, set session data
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      numberID: user.numberID,
      organization: user.organization,
      mobile_number: user.mobile_number,
    };

    // Set the user ID in the session
    req.session.userId = user._id;

    // Redirect to the home page or dashboard
    return res.redirect('/');
  } catch (error) {
    console.error('Login Error:', error); // Log the error for debugging
    return res.status(500).send('Internal server Error');
  }
};

exports.list = async (req, res) => {
  try {
    res.render('login', {username: '', error: null});
  } catch (error) {
    console.log(error);
  }
};
