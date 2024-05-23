const Auth = require('../Models/Auth');
exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Auth.findById({_id: id});
    req.session.user
      ? res.render('edit', {userLoggedIn: true, user: user})
      : res.render('edit', {userLoggedIn: false});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
