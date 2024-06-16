const {ReturnDocument} = require('mongodb');
const User = require('../Models/Auth');
const axios = require('axios');
const member_API = process.env.Member_API;
const bcrypt = require('bcryptjs');

exports.read = async (req, res) => {
  const error_msg = '';
  const page = parseInt(req.query.page) || 1; // Parse page number from query parameters (default to page 1)
  const limit = 5; // Number of users per page

  try {
    // Fetch users for the current page
    const usersResponse = await axios.get('http://localhost:3000/member', {
      params: {
        page: page,
        limit: limit,
      },
    });

    const usersResponseCount = await axios.get(member_API);
    const usersCount = usersResponseCount.data; // Assuming this returns an array of users count
    const users = usersResponse.data; // Assuming this returns an array of users

    const totalUsers = usersCount.length; // Count of total users
    const totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

    const responseData = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      currentPage: page,
      totalPages,
      error_msg,
    };

    res.render('member', responseData); // Render the 'member' template with pagination data
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.list = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is a positive integer
    const limit = parseInt(req.query.limit) || 10; // Limit of items per page, default is 10

    const skip = (page - 1) * limit;
    let users = [];

    if (page && limit) {
      users = await User.find().skip(skip).limit(limit).exec();
    } else {
      users = await User.find().exec();
    }

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
    numberID,
    password,
    firstname,
    lastname,
    organization,
    role,
    mobile_number,
    birth_year,
  } = req.body;
  let hash_password;
  if (password) {
    hash_password = bcrypt.hashSync(password, 10);
  }
  try {
    const user = await User.findByIdAndUpdate(id, {
      role,
      firstname,
      lastname,
      organization,
      mobile_number,
      birth_year,
      password: hash_password,
      numberID,
      username: numberID,
    });
    console.log('update successfully');
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
