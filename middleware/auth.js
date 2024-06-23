const User = require('../Models/Auth');
module.exports = (req, res, next) => {
  User.findById(req.session.userId)
    .then(user => {
      if (!user) {
        return res.redirect('/');
      }
      next();
    })
    .catch(e => {
      console.error(e);
    });
};
