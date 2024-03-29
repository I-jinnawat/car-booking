exports.list = async (req, res) => {
  try {
    res.render("car");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
