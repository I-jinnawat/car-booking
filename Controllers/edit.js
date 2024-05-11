exports.list = async (req, res) => {
  try {
    req.session.user
      ? res.render('edit', {userLoggedIn: true, user: req.session.user})
      : res.render('edit', {userLoggedIn: false});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
