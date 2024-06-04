const bcrypt = require('bcryptjs');
const Auth = require('../Models/Auth');
const zxcvbn = require('zxcvbn');
const axios = require('axios');
const member_API = process.env.member_API;

exports.create = async (req, res) => {
  const usersResponse = await axios.get(`${member_API}`, {});
  const users = usersResponse.data;
  const {
    firstname,
    lastname,
    numberID,
    username,
    password,
    organization,
    role,
    birth_year,
    mobile_number,
  } = req.body;

  // Validate phone number length
  if (mobile_number.length !== 10 || !/^\d+$/.test(mobile_number)) {
    req.flash('error_msg', 'เบอร์โทรต้องมี 10 หลัก');
    const error_msg = req.flash('error_msg');
    return res.status(400).render('member', {
      user: req.session.user || null,
      users: users,
      userLoggedIn: !!req.session.user,
      firstname: firstname,
      lastname: lastname,
      numberID: numberID,
      username: username,
      organization: organization,
      role: role,
      birth_year: birth_year,

      error_msg: error_msg,
    });
  }

  // Validate password security
  const result = zxcvbn(password);
  if (result.score < 2) {
    req.flash('error_msg', 'รหัสผ่านไม่ปลอดภัยพอ');
    const error_msg = req.flash('error_msg');
    return res.status(400).render('member', {
      user: req.session.user || null,
      users: users,
      userLoggedIn: !!req.session.user,
      firstname: firstname,
      lastname: lastname,
      numberID: numberID,
      username: username,
      organization: organization,
      role: role,
      birth_year: birth_year,
      mobile_number: mobile_number,
      error_msg: error_msg,
    });
  }

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
      mobile_number,
    });
    req.flash('success_msg', 'User created successfully');
    res.redirect('/setting/member');
  } catch (err) {
    console.error(err);

    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      // Handle duplicate username error
      req.flash('error_msg', 'รหัสพนักงานมีอยู่แล้ว');
      const error_msg = req.flash('error_msg');
      return res.status(400).render('member', {
        user: req.session.user || null,
        users: users,
        userLoggedIn: !!req.session.user,
        firstname: firstname,
        lastname: lastname,
        numberID: numberID,
        username: username,
        organization: organization,
        role: role,
        birth_year: birth_year,
        mobile_number: mobile_number,
        error_msg: error_msg,
      });
    } else {
      // Handle other errors
      res.status(500).send('An error occurred while creating the user');
    }
  }
};
exports.update = async (req, res) => {
  const {id} = req.params;
  const {
    newfirstname,
    newlastname,
    newmobile_number,
    oldpassword,
    newpassword,
    newpasswordconfirm,
  } = req.body;

  try {
    let user = await Auth.findById(id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }

    if (newfirstname || newlastname || newmobile_number) {
      user.firstname = newfirstname;
      user.lastname = newlastname;
      user.mobile_number = newmobile_number;

      try {
        await user.save();
        req.flash('success', 'User updated successfully.');
        return res.redirect('/profile/' + id);
      } catch (err) {
        // Catch validation errors
        if (err.name === 'ValidationError') {
          req.flash('error', err.errors['mobile_number'].message);
          return res.status(400).redirect('/profile/edit/' + id);
        }
        throw err; // Throw other errors to the catch block
      }
    }

    // Change password
    if (newpassword && oldpassword) {
      if (!bcrypt.compareSync(oldpassword, user.password)) {
        req.flash('error_old', 'รหัสผ่านเดิมไม่ถูกต้อง');
        return res.redirect('/profile/Change_PSW/' + id);
      }

      user.password = bcrypt.hashSync(newpassword, 10);
      await user.save();
      req.flash('success', 'เปลี่ยนรหัสผ่านสำเร็จ');
      return res.redirect('/profile/' + id);
    }

    if (newpassword && newpasswordconfirm) {
      try {
        user.password = bcrypt.hashSync(newpasswordconfirm, 10);
        await user.save();
        res.redirect('/login');
      } catch (error) {
        res.send('test4');
      }
    }

    await user.save();
  } catch (err) {
    console.error('Error updating user:', err.message);
    req.flash('error', 'An error occurred while updating user information.');
    res.redirect('/profile/' + id);
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
