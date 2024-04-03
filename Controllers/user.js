const bcrypt = require("bcryptjs");
const session = require("express-session");
const Auth = require("../Models/Auth");

exports.create = async (req, res) => {
  const { firstname, lastname, numberID, username, password, organization } =
    req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await Auth.create({
      firstname,
      lastname,
      numberID,
      username,
      password: hashedPassword,
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
exports.update = async (req, res) => {
  const { id } = req.params; // Assuming you have an ID parameter in your route
  const { firstname, lastname, numberID, username, password, organization } =
    req.body;

  try {
    // Find the user by ID
    let user = await Auth.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user fields
    user.firstname = firstname;
    user.lastname = lastname;
    user.numberID = numberID;
    user.username = username;
    user.organization = organization;

    // Check if password is provided and hash it
    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    // Save the updated user
    await user.save();

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await Auth.findOne({ _id: id }).exec();
    res.send(User);
  } catch (error) {
    console.log(error);
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await Auth.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    }).exec();
    res.send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
