exports.list = async (req, res) => {
  try {
    res.render("member");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
