exports.list = async (req, res) => {
  try {
    req.session.user
      ? res.render("car", { userLoggedIn: true, user: req.session.user })
      : res.render("car", { userLoggedIn: false });
  } catch (error) {
    console.log(error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};
