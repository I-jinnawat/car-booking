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
  const {newfirstname, newlastname, oldpassword, newpassword} = req.body;

  try {
    let user = await Auth.findById(id); // Finding the user by id
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/profile/' + id);
    }

    // Update firstname and lastname if provided
    if (newfirstname && newlastname) {
      user.firstname = newfirstname;
      user.lastname = newlastname;
    }

    // If old password and new password are provided
    if (oldpassword && newpassword) {
      if (!bcrypt.compareSync(oldpassword, user.password)) {
        req.flash('error', 'รหัสผ่านเดิมไม่ถูกต้อง');
        return res.redirect('/profile/' + id); // Return here if old password doesn't match
      }
      try {
        user.password = bcrypt.hashSync(newpassword, 10);
      } catch (hashError) {
        console.error('Error hashing new password:', hashError.message);
        req.flash('error', 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        return res.redirect('/profile/' + id);
      }
    }

    // Saving the updated user
    await user.save();
    res.redirect('/profile/' + id); // Redirect to the user's profile page after successful update
  } catch (err) {
    console.error('Error updating user:', err.message);
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
