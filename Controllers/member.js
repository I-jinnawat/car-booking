const {ReturnDocument} = require('mongodb');
const User = require('../Models/Auth');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const member_API = process.env.Member_API;

exports.read = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Parse page number from query parameters (default to page 1)
  const limit = 5; // Number of users per page
  const error_msg = '';

  try {
    // Fetch users for the current page
    const usersResponse = await axios.get(member_API, {
      params: {
        page: page,
        limit: limit,
      },
    });

    const usersResponseCount = await axios.get(member_API);
    const usersCount = usersResponseCount.data.length;
    const users = usersResponse.data;
    const totalPages = Math.ceil(usersCount / limit);

    const responseData = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      currentPage: page,
      totalPages: totalPages,
      error_msg: error_msg,
    };

    res.render('member', responseData);
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
  const {id} = req.params;
  const page = parseInt(req.query.page) || 1; // Parse page number from query parameters (default to page 1)
  const limit = 5; // Number of users per page

  try {
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

    const updateData = {
      role,
      firstname,
      lastname,
      organization,
      mobile_number,
      birth_year,
      numberID,
      username: numberID,
    };

    if (password) {
      updateData.password = hash_password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log('Update successful');

    // Fetch users for the current page after update
    const usersResponse = await axios.get(member_API, {
      params: {
        page: page,
        limit: limit,
      },
    });

    const usersResponseCount = await axios.get(member_API);
    const usersCount = usersResponseCount.data.length;
    const users = usersResponse.data;
    const totalPages = Math.ceil(usersCount / limit);

    res.render('member', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: users,
      currentPage: page,
      totalPages: totalPages,
      error_msg: null,
    });
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
    const usersResponseCount = await axios.get(member_API);
    const usersCount = usersResponseCount.data.length;
    const users = usersResponse.data;
    const totalPages = Math.ceil(usersCount / limit);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
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

exports.remove = async (req, res) => {
  const {id} = req.params;

  try {
    await User.findByIdAndDelete(id);

    // Optionally, redirect to a different page or send a response
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting User:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
