const bcrypt = require("bcryptjs");
const session = require("express-session");

const Auth = require("../Models/Auth");

// exports.read = async (req, res) => {
//   const { username, password } = req.body;
//   const user = await Auth.findone({ username });
//   if (user && bcrypt.compareSync(password, user.password)) {
//     req.session.user = user;
//     res.redirect("/dashboard");
//   } else {
//     res.send("invalid");
//   }
//   try {
//     await res.render("login");
//   } catch (err) {
//     res.send("404 file not found");
//   }
// };
exports.read = async (req, res) => {
  res.render("login");
};
