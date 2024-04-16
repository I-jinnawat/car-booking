const User = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    res.render('forgot_PSW', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
      errorMessage: null,
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
      const userId = user._id;
      res.render(`Change_PSW`, {
        userLoggedIn: false,
        user: user,
        errorMessage: '',
      });
    } else {
      // If no matching user is found
      res.render('forgot_PSW', {errorMessage: 'ไม่พบผู้ใช้งาน'}); // Render the forgot password page with an error message
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).send('เกิดข้อผิดพลาดบางอย่าง'); // Send a generic server error message
  }
};
