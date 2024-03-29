const app = require("../App");
exports.list = async (req, res) => {
  try {
    res.render("manage");
  } catch (error) {
    console.log(error);
  }
};
