const Auth = require("../Models/Auth");
exports.list = async (req, res) => {
  try {
    if (req.session.user) {
      res.render("profile", { userLoggedIn: true, user: req.session.user });
      console.log(req.session.user.admin);
    } else {
      res.render("dashboard", { userLoggedIn: false, user: req.session.user });
    }
  } catch {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
