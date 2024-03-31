const bcrypt = require("bcryptjs");
const session = require("express-session");

const Auth = require("../Models/Auth");

exports.create = async (req, res) => {
  const { username, password, name, numberId, organization } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await Auth.create({
      username,
      password: hashedPassword,
      name,
      numberId,
      organization,
    });
    // res.redirect("/");
    res.send("sucessfully");
  } catch (err) {
    console.error(err);
    // res.redirect("/register");
  }
};

exports.list = async (req, res) => {
  try {
    const producted = await Auth.find({}).exec();
    res.send(producted);
    // res.send("Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
