const User = require("../Models/Auth");
const bcrypt = require("bcryptjs");
const app = require("../App"); // Import your Express app instance

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        req.session.user = user;
        return res.redirect("/");
      }
    }

    res.render("login", { error: "Invalid username or password" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.list = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};
