const Product = require("../Models/product");

exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id }).exec();
    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

exports.list = async (req, res) => {
  try {
    const producted = await Product.find({}).exec();
    res.send(producted);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
exports.creat = async (req, res) => {
  try {
    const product = await Product(req.body).save();
    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    res.send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Product.findOneAndDelete({ _id: id }).exec();
    res.send(removed);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
