const bcrypt = require('bcryptjs');
const Auth = require('../Models/Auth');
const axios = require('axios');
const member_API = process.env.member_API;

exports.create = async (req, res) => {
  const usersResponse = await axios.get(`${member_API}`, {});

  const page = parseInt(req.query.page) || 1; // Parse page number from query parameters (default to page 1)
  const limit = 8; // Number of users per page

  const {
    firstname,
    lastname,
    numberID,
    password,
    organization,
    role,
    birth_year,
    mobile_number,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    await Auth.create({
      firstname,
      lastname,
      numberID,
      username: numberID,
      password: hashedPassword,
      organization,
      role,
      birth_year,
      mobile_number,
    });
    req.flash('success_msg', 'User created successfully');
    res.redirect('/setting/member');
  } catch (err) {
    console.error(err.message);
    const {
      numberID,
      password,
      firstname,
      lastname,
      organization,
      role,
      mobile_number,
      birth_year,
    } = req.body;
    const usersResponse = await axios.get(member_API, {
      params: {
        page: page,
        limit: limit,
      },
    });
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      const usersResponseCount = await axios.get(member_API);
      const usersCount = usersResponseCount.data.length;
      const users = usersResponse.data;
      const totalPages = Math.ceil(usersCount / limit);
      // Handle duplicate username error
      req.flash('error_msg', 'รหัสพนักงานมีอยู่แล้ว');
      const error_msg = req.flash('error_msg');
      return res.status(400).render('member', {
        user: req.session.user || null,
        userLoggedIn: !!req.session.user,
        users: users,
        currentPage: page,
        totalPages: totalPages,
        firstname: firstname,
        lastname: lastname,
        numberID: numberID,
        username: numberID,
        organization: organization,
        role: role,
        birth_year: birth_year,
        mobile_number: mobile_number,
        error_msg: error_msg,
      });
    } else {
      // Handle other errors
      res.status(500).send('An error occurred while updating the user');
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
  } = req.body;

  const start = new Date(
    new Date(req.body.birth_year).getTime() + 7 * 60 * 60 * 1000
  );

  try {
    let user = await Auth.findById(id);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/');
    }

    if (
      newfirstname ||
      newlastname ||
      newmobile_number ||
      req.body.birth_year
    ) {
      user.firstname = newfirstname || user.firstname;
      user.lastname = newlastname || user.lastname;
      user.mobile_number = newmobile_number || user.mobile_number;
      user.birth_year = req.body.birth_year ? start : user.birth_year;
      await user.save();
    }
    if (!bcrypt.compareSync(oldpassword, user.password)) {
      req.flash('error_old', 'รหัสผ่านเดิมไม่ถูกต้อง');
      error_old = req.flash('error_old');
      return res.render('change_PSW', {
        userLoggedIn: true,
        oldpassword: oldpassword || '',
        user: user,
        error_old,
      });
    }

    // Update password
    user.password = bcrypt.hashSync(newpassword, 10);
    await user.save();

    req.session.destroy(() => {
      res.redirect(`/login?username=${encodeURIComponent(user.username)}`);
    });
  } catch (err) {
    console.error(err);
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
