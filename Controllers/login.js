const User = require('../Models/Auth');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (user) {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        req.session.user = {
          id: user._id,
          username: user.username,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
          numberID: user.numberID,
          organization: user.organization,
        };
        // res.send(req.session.user);
        // Set the user ID in the session
        req.session.userId = user._id;

        return res.redirect('/');
      }
    }
    // Pass error message to the view
    res.render('login', {error: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง'});
  } catch (error) {
    res.status(500).send('Internal server Error');
  }
};

exports.list = async (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    console.log(error);
  }
};
