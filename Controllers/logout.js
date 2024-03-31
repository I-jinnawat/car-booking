exports.logout = async (req, res) => {
  try {
    req.session.user
      ? res.render("dashboard", { userLoggedIn: false, user: req.session.user })
      : res.redirect("/");
  } catch (error) {
    console.error(error);
  }
};
