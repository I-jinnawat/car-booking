const Auth = require("../Models/Auth");
exports.list = async (req, res) => {
  try {
    const id = req.params.id;
    // Fetch the user data from the database, for example:
    const user = await Auth.findById({ _id: id }); // Assuming you have the user ID stored in req.user.id

    // Render the profile page and pass the user object to the template
    res.render("profile", { userLoggedIn: true, user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
