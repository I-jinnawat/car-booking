const {NOTFOUND} = require('dns');
const User = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    res.render('forgot_PSW', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
      NotFound: '',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
exports.check = async (req, res) => {
  const {username, birth_year} = req.query; // Since the form uses method="GET", access query parameters instead of body
  try {
    const user = await User.findOne({username, birth_year}); // Assuming dateOfBirth is the field name in your User model

    if (user) {
      res.render(`Change_PSW`, {
        userLoggedIn: false,
        user: user,
        error_old: '',
      });
    } else {
      // If no matching user is found
      req.flash('NotFound', 'ไม่พบผู้ใช้งาน');
      const NotFound = req.flash('NotFound');
      res.render('forgot_PSW', {
        NotFound: NotFound,
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).send('เกิดข้อผิดพลาดบางอย่าง'); // Send a generic server error message
  }
};
