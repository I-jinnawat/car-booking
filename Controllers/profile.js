const Auth = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    // Fetch the user data from the database, for example:
    const user = await Auth.findById({_id: id}); // Assuming you have the user ID stored in req.user.id
    const errorMessage = req.flash('error');

    // Render the profile page and pass the user object and error message to the template
    res.render('profile', {
      userLoggedIn: true,
      user: user,
      errorMessage: errorMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
