exports.list = async (req, res) => {
  try {
    res.render('add-document', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
