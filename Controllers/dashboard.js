exports.read = async (req, res) => {
  try {
    res.render("dashboard");
  } catch (error) {
    console.log(error);
  }
};
