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
        req.session.user = {
          id: user._id,
          username: user.username,
          admin: user.admin,
          firstname: user.firstname,
          lastname: user.lastname,
          numberID: user.numberID,
          organization: user.organization,
        };

        return res.redirect("/");
      }
    }
    // Pass error message to the view
    res.render("login", { error: "invalid username or password" });
  } catch (error) {
    res.status(500).send("Internal server Error");
  }
};

exports.list = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};
