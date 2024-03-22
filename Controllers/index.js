const path = require("path");
const item = require("../Models/index");

exports.read = async (req, res) => {
  try {
    const Items = await item.find({}).exec();
    res.send(Items);
    // res.send("hoddood");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Server Error`);
  }
};
exports.list = async (req, res) => {
  try {
    const htmlFile = path.join(__dirname, "../Views/index.html");
    res.sendFile(htmlFile);
    // res.send("hellow world");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.creat = async (req, res) => {
  try {
    const Items = await item(req.body).save();
    res.send(Items);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
