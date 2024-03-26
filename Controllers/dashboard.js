const path = require("path");
const item = require("../Models/index");

exports.list = async (req, res) => {
  try {
    const htmlFile = path.join(__dirname, "../Views/index2.html");
    res.sendFile(htmlFile);
    // res.send("hellow world");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
