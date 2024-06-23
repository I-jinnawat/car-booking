const User = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    res.render('forgot_PSW', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
      notfound: '',
      username: '',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
exports.check = async (req, res) => {
  const {username, birth_year} = req.query; // Access query parameters since the form uses method="GET"

  try {
    const user = await User.findOne({username});

    if (user) {
      const year = new Date(user.birth_year).getFullYear();
      const birthYearInt = parseInt(birth_year, 10); // Ensure birth_year is parsed as an integer

      if (year === birthYearInt) {
        res.render('change_PSW', {
          user: user,
          error_old: '',
          userLoggedIn: false,
          username: username || '',
        });
      } else {
        res.render('forgot_PSW', {
          error: 'ปีเกิดไม่ถูกต้อง',
          username: username || '',
        });
      }
    } else {
      res.render('forgot_PSW', {
        error: 'ไม่พบผู้ใช้งาน',
        username: username || '',
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.sendStatus(500).send('เกิดข้อผิดพลาดบางอย่าง'); // Send a generic server error message
  }
};
