exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      err
        ? console.error("Error destroying session:", err).sendStatus(500)
        : res.redirect("/");
    });
  } catch (error) {
    console.error(error);
  }
};
