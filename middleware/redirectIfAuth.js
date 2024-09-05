module.exports = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user !== 'user') {
      return res.redirect('/manage');
    } else {
      return res.redirect('/dashboard');
    }
  }
  next();
};
