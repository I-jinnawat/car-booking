const bcrypt = require('bcryptjs');
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
    birth_year,
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
      birth_year,
    });

    res.redirect('/setting/member');
  } catch (err) {
    console.error(err);
  }
};

exports.update = async (req, res) => {
  const {id} = req.params;
  const {newfirstname, newlastname, oldpassword, newpassword} = req.body;

  try {
    let user = await Auth.findById(id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }

    // Update user information
    if (newfirstname) {
      user.firstname = newfirstname;
    }
    if (newlastname) {
      user.lastname = newlastname;
    }
    if (newpassword && oldpassword) {
      // Change password
      if (!bcrypt.compareSync(oldpassword, user.password)) {
        req.flash('error_old', 'รหัสผ่านเดิมไม่ถูกต้อง');
        return res.redirect('/profile/Change_PSW/' + id);
      }
      user.password = bcrypt.hashSync(newpassword, 10);
      await user.save();
      req.flash('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
      return res.redirect('/profile/' + id);
    }

    await user.save();
  } catch (err) {
    console.error('Error updating user:', err.message);
    req.flash('error', 'An error occurred while updating user information.');
    res.redirect('/manage');
  }
};

exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await Auth.findOne({_id: id}).exec();
    res.send(User);
  } catch (error) {
    console.log(error);
  }
};
