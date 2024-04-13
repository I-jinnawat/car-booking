const bcrypt = require('bcryptjs');
const session = require('express-session');
const Auth = require('../Models/Auth');

exports.create = async (req, res) => {
  const {
    firstname,
    lastname,
    numberID,
    username,
    password,
    organization,
    role,
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    await Auth.create({
      firstname,
      lastname,
      numberID,
      username,
      password: hashedPassword,
      organization,
      role,
    });

    res.send('sucessfully');
  } catch (err) {
    console.error(err);
  }
};

exports.list = async (req, res) => {
  try {
    const producted = await Auth.find({}).exec();
    res.send(producted);
    // res.send("Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

exports.update = async (req, res) => {
  const {id} = req.params;
  const {newfirstname, newlastname, oldpassword, newpassword} = req.body; // Added oldpassword and newpassword

  try {
    let user = await Auth.findById(id); // Finding the user by id
    if (!user) {
      // If user not found
      return res.status(404).send('user not found');
    }
    // Updating user's first name and last name
    if (newfirstname && newlastname) {
      user.firstname = newfirstname;
      user.lastname = newlastname;
    }
    // If old password and new password provided, verify old password and update password
    if (oldpassword && newpassword) {
      if (!bcrypt.compareSync(oldpassword, user.password)) {
        // If old password does not match
        return res.status(400).send('password wrong');
      }
      user.password = bcrypt.hashSync(newpassword, 10);
    }
    // Saving the updated user
    await user.save();

    // Update session user info if needed (not implemented here)

    res.redirect('/profile/' + id); // Redirect to the user's profile page after successful update
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await Auth.findOne({_id: id}).exec();
    // res.send(User);
  } catch (error) {
    console.log(error);
  }
};
