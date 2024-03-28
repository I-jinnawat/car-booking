exports.read = async (req, res) => {
  try {
    await res.render("login");
  } catch (err) {
    res.send("404 file not found");
  }
};
