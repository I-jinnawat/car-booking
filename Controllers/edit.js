exports.list = async (req, res) => {
  try {
    res.render("edit");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};