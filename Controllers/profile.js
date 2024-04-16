const Auth = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Auth.findById({_id: id});
    res.render('profile', {
      userLoggedIn: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
exports.change_PSW = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Auth.findById({_id: id});
    const errorMessage = req.flash('error_old');

    res.render('change_PSW', {
      userLoggedIn: true,
      user: user,
      errorMessage: errorMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
