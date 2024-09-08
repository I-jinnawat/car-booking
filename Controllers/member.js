const {ReturnDocument} = require('mongodb');
const User = require('../Models/Auth');
const Booking = require('../Models/booking');
const bcrypt = require('bcryptjs');

const member_API = process.env.Member_API;

// Helper function to fetch users and count
// const fetchUsers = async (page, limit, searchTerm = '') => {
//   let query = {};

//   if (searchTerm) {
//     let roleQuery = searchTerm;

//     if (searchTerm === 'พนักงาน') {
//       roleQuery = 'user';
//     } else if (searchTerm === 'ผู้จัดรถ') {
//       roleQuery = 'admin';
//     } else if (searchTerm === 'ผู้อนุมัติ') {
//       roleQuery = 'approver';
//     } else if (searchTerm === 'พนักงานขับรถ') {
//       roleQuery = 'driver';
//     }

//     query = {
//       $or: [
//         {firstname: {$regex: searchTerm, $options: 'i'}},
//         {lastname: {$regex: searchTerm, $options: 'i'}},
//         {numberID: {$regex: searchTerm, $options: 'i'}},
//         {organization: {$regex: searchTerm, $options: 'i'}},
//         {role: {$regex: roleQuery, $options: 'i'}},
//       ],
//     };
//   }

//   const sortOrder = {
//     approver: 1,
//     admin: 2,
//     user: 3,
//     driver: 4,
//   };

//   // Fetch all users matching the query
//   const users = await User.find(query).exec();

//   // Sort users according to the sortOrder mapping
//   const sortedUsers = users.sort((a, b) => {
//     return sortOrder[a.role] - sortOrder[b.role];
//   });

//   // Calculate total count before pagination
//   const totalUsersCount = sortedUsers.length;

//   // Apply pagination
//   const paginatedUsers = sortedUsers.slice((page - 1) * limit, page * limit);

//   return {
//     users: paginatedUsers,
//     totalPages: Math.ceil(totalUsersCount / limit),
//   };
// };

exports.list = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // Current page
  const limit = 8; // Users per page
  const skip = (page - 1) * limit; // Skip users based on the current page
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';

  let roleQuery = searchQuery;
  if (searchQuery) {
    if (searchQuery === 'พนักงาน') {
      roleQuery = 'user';
    } else if (searchQuery === 'ผู้จัดรถ') {
      roleQuery = 'admin';
    } else if (searchQuery === 'ผู้อนุมัติ') {
      roleQuery = 'approver';
    } else if (searchQuery === 'พนักงานขับรถ') {
      roleQuery = 'driver';
    }
  }

  try {
    // Aggregate query for searching and sorting in MongoDB
    const query = searchQuery
      ? {
          $or: [
            {firstname: {$regex: searchQuery, $options: 'i'}},
            {lastname: {$regex: searchQuery, $options: 'i'}},
            {numberID: {$regex: searchQuery, $options: 'i'}},
            {organization: {$regex: searchQuery, $options: 'i'}},
            {role: {$regex: roleQuery, $options: 'i'}},
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(query);

    // Use aggregate to sort and paginate
    let users = await User.aggregate([
      {$match: query},
      {
        $addFields: {
          sortRole: {
            $switch: {
              branches: [
                {case: {$eq: ['$role', 'approver']}, then: 1},
                {case: {$eq: ['$role', 'admin']}, then: 2},
                {case: {$eq: ['$role', 'user']}, then: 3},
                {case: {$eq: ['$role', 'driver']}, then: 4},
              ],
              default: 5, // Handle unexpected roles
            },
          },
        },
      },
      {$sort: {sortRole: 1}}, // Sort by the mapped role order
      {$skip: skip},
      {$limit: limit},
    ]);

    const totalPages = Math.ceil(totalUsers / limit); // Calculate total pages

    const responseData = {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      searchQuery,
      error_msg: '',
    };

    res.render('member', responseData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

// exports.API_member = async (req, res) => {
//   try {
//     const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
//     const limit = parseInt(req.query.limit) || 10;
//     const searchTerm = req.query.search || ''; // Get search term from query parameter

//     let query = {};

//     if (searchTerm) {
//       let roleQuery = searchTerm;

//       if (searchTerm === 'พนักงาน') {
//         roleQuery = 'user';
//       } else if (searchTerm === 'ผู้จัดรถ') {
//         roleQuery = 'admin';
//       } else if (searchTerm === 'ผู้อนุมัติ') {
//         roleQuery = 'approver';
//       } else if (searchTerm === 'พนักงานขับรถ') {
//         roleQuery = 'driver';
//       }

//       query = {
//         $or: [
//           {firstname: {$regex: searchTerm, $options: 'i'}},
//           {lastname: {$regex: searchTerm, $options: 'i'}},
//           {numberID: {$regex: searchTerm, $options: 'i'}},
//           {organization: {$regex: searchTerm, $options: 'i'}},
//           {role: {$regex: roleQuery, $options: 'i'}},
//         ],
//       };
//     }

//     const sortOrder = {
//       approver: 1,
//       admin: 2,
//       user: 3,
//       driver: 4,
//     };

//     // Fetch all users matching the query
//     const users = await User.find(query).exec();

//     // Sort users according to the sortOrder mapping
//     const sortedUsers = users.sort((a, b) => {
//       return sortOrder[a.role] - sortOrder[b.role];
//     });

//     // Apply pagination
//     const paginatedUsers = sortedUsers.slice((page - 1) * limit, page * limit);

//     res.json(paginatedUsers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Internal Server Error'});
//   }
// };

exports.update = async (req, res) => {
  const {id} = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 8;
  const skip = (page - 1) * limit; // Skip users based on the current page
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';

  let roleQuery = searchQuery;
  if (searchQuery) {
    if (searchQuery === 'พนักงาน') {
      roleQuery = 'user';
    } else if (searchQuery === 'ผู้จัดรถ') {
      roleQuery = 'admin';
    } else if (searchQuery === 'ผู้อนุมัติ') {
      roleQuery = 'approver';
    } else if (searchQuery === 'พนักงานขับรถ') {
      roleQuery = 'driver';
    }
  }

  const sortOrder = {
    approver: 1,
    admin: 2,
    user: 3,
    driver: 4,
  };

  try {
    const query = searchQuery
      ? {
          $or: [
            {firstname: {$regex: searchQuery, $options: 'i'}},
            {lastname: {$regex: searchQuery, $options: 'i'}},
            {numberID: {$regex: searchQuery, $options: 'i'}},
            {organization: {$regex: searchQuery, $options: 'i'}},
            {role: {$regex: roleQuery, $options: 'i'}},
          ],
        }
      : {};

    const totalUsers = await User.countDocuments(query); // Define totalUsers here

    let users = await User.aggregate([
      {$match: query},
      {
        $addFields: {
          sortRole: {
            $switch: {
              branches: [
                {case: {$eq: ['$role', 'approver']}, then: 1},
                {case: {$eq: ['$role', 'admin']}, then: 2},
                {case: {$eq: ['$role', 'user']}, then: 3},
                {case: {$eq: ['$role', 'driver']}, then: 4},
              ],
              default: 5,
            },
          },
        },
      },
      {$sort: {sortRole: 1}},
      {$skip: skip},
      {$limit: limit},
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

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
    const booking = await Booking.find({user_id: id});
    if (
      (firstname || lastname || organization || mobile_number) &&
      booking.length > 0
    ) {
      await Booking.updateMany(
        {user_id: id},
        {
          $set: {
            userinfo: `${firstname} ${lastname}`,
            organization,
            mobile_number,
          },
        }
      );
    }

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

    // res.render('member', {
    //   userLoggedIn: !!req.session.user,
    //   user: req.session.user || null,
    //   users,
    //   currentPage: page,
    //   searchQuery,
    //   totalUsers,
    //   totalPages,
    //   error_msg: null,
    // });
    res.redirect('/setting/member');
  } catch (error) {
    console.error(error.message);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
      req.flash('error_msg', 'รหัสพนักงานมีอยู่แล้ว');
    }

    const error_msg = req.flash('error_msg');
    const query = searchQuery
      ? {
          $or: [
            {firstname: {$regex: searchQuery, $options: 'i'}},
            {lastname: {$regex: searchQuery, $options: 'i'}},
            {numberID: {$regex: searchQuery, $options: 'i'}},
            {organization: {$regex: searchQuery, $options: 'i'}},
            {role: {$regex: roleQuery, $options: 'i'}},
          ],
        }
      : {};
    const totalUsers = await User.countDocuments(query); // Define totalUsers here

    res.status(400).render('member', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      users: await User.find(), // Ensure `users` is fetched again if needed
      currentPage: page,
      searchQuery,
      totalUsers: totalUsers || 0, // Ensure `totalUsers` is defined
      totalPages: Math.ceil((await User.countDocuments()) / limit),
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
