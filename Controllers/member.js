const {ReturnDocument} = require('mongodb');
const User = require('../Models/Auth');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const member_API = process.env.Member_API;

// Helper function to fetch users and count
const fetchUsers = async (page, limit, searchTerm = '') => {
  let query = {};
  if (searchTerm) {
    query = {
      $or: [
        {firstname: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on firstname
        {lastname: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on lastname
        {organization: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on organization
      ],
    };
  }

  const usersResponse = await axios.get(member_API, {
    params: {page, limit, query},
  });

  const usersResponseCount = await axios.get(member_API, {params: {query}});
  const usersCount = usersResponseCount.data.length;

  return {
    users: usersResponse.data,
    totalPages: Math.ceil(usersCount / limit),
  };
};

exports.list = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 8;

  try {
    const {users, totalPages} = await fetchUsers(page, limit);

    const responseData = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users,
      currentPage: page,
      totalPages,
      error_msg: '',
    };

    res.render('member', responseData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.API_member = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || ''; // Get search term from query parameter

    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          {firstname: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on firstname
          {lastname: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on lastname
          {organization: {$regex: searchTerm, $options: 'i'}}, // Case-insensitive search on organization
        ],
      };
    }

    const users = await User.find(query).skip(skip).limit(limit).exec();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.update = async (req, res) => {
  const {id} = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 8;

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

    const updateData = {
      numberID,
      password: password ? bcrypt.hashSync(password, 10) : undefined,
      firstname,
      lastname,
      organization,
      role,
      mobile_number,
      birth_year,
      username: numberID,
    };

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log('Update successful');

    const {users, totalPages} = await fetchUsers(page, limit);

    res.render('member', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users,
      currentPage: page,
      totalPages,
      error_msg: null,
    });
  } catch (error) {
    console.error(error.message);

    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      req.flash('error_msg', 'รหัสพนักงานมีอยู่แล้ว');
    }

    const {users, totalPages} = await fetchUsers(page, limit);
    const error_msg = req.flash('error_msg');

    res.status(400).render('member', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users,
      currentPage: page,
      totalPages,
      ...req.body,
      error_msg,
    });
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
