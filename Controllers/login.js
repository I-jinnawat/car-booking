const bcrypt = require("bcryptjs");
const session = require("express-session");

const Auth = require("../Models/Auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await Auth.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    // req.session.user = user;
    // res.redirect("/dashboard");
    res.send("sucessfully");
  } else {
    res.send("Invalid username or password");
  }
};

exports.list = async (req, res) => {
  try {
    const producted = await Auth.find({}).exec();
    // res.send(producted);
    res.send(producted);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
// exports.list = async (req, res) => {
//   try {
//     res.render("login");
//   } catch (error) {
//     console.error(error);
//     res.status(404).send("404 file not found"); // Changed to set proper status code
//   }
// };
