const app = require("../App");
const User = require("../Models/Auth");

exports.read = async (req, res) => {
  try {
    // Check if user session exists
    if (req.session.user) {
      // If user is logged in, render dashboard with user information
      res.render("dashboard", { userLoggedIn: true, user: req.session.user });
    } else {
      // If user is not logged in, render dashboard without user information
      res.render("dashboard", { userLoggedIn: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};
