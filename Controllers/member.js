const {ReturnDocument} = require('mongodb');
const User = require('../Models/Auth');
const axios = require('axios');
const member_API = process.env.member_API;

exports.read = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Check if there's a flash message stored in the session
    const error_msg = req.flash('error_msg');

    // const users = await User.find().skip(skip).limit(limit).lean();
    const usersResponse = await axios.get(`${member_API}`, {
      params: {
        skip,
        limit,
      },
    });
    const users = usersResponse.data;

    const data = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      totalPages: totalPages,
      currentPage: parseInt(page),
      error_msg: error_msg,
    };

    if (req.session.user) {
      res.render('member', data);
    } else {
      res.render('dashboard', {
        userLoggedIn: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.list = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.update = async (req, res) => {
  const usersResponse = await axios.get(`${member_API}`);
  const users = usersResponse.data;
  const {id} = req.params;
  const {
    password,
    firstname,
    lastname,
    organization,
    role,
    mobile_number,
    birth_year,
  } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, {
      role,
      firstname,
      lastname,
      organization,
      mobile_number,
      birth_year,
      password,
    });

    res.render('member', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      error_msg: null,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.remove = async (req, res) => {
  const {id} = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting User:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
