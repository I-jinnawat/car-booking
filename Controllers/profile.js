exports.read = async (req, res) => {
  try {
    res.render("proflie");
  } catch (error) {
    console.log(error);
  }
};
