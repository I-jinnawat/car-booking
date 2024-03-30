const app = require("../App");
exports.list = async (req, res) => {
  try {
    req.session.user
      ? res.render("manage", { userLoggedIn: true, user: req.session.user })
      : res.render("manage", { userLoggedIn: false });
  } catch (error) {
    console.log(error);
  }
};
