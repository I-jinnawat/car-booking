exports.read = async (req, res) => {
  try {
    // const id = req.params.id;
    // const product = await Product.findOne({ _id: id }).exec();
    res.render("proflie");
  } catch (error) {
    console.log(error);
  }
};
