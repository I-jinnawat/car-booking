const Booking = require('../Models/booking');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = 8;
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';
  const selectedStatus = req.query.status || 'all';

  const user = req.session.user;

  // Determine the query filter based on user role, search query, and status filter
  const filter = {
    status: {$lte: 5},
    $or: [
      {
        title: {$regex: searchQuery, $options: 'i'},
      },
      {
        userinfo: {$regex: searchQuery, $options: 'i'},
      },
      {
        adminName: {$regex: searchQuery, $options: 'i'},
      },
      {
        vehicle: {$regex: searchQuery, $options: 'i'},
      },
      {
        driver: {$regex: searchQuery, $options: 'i'},
      },
    ],
  };

  if (user.role === 'user') {
    filter.user_id = user.id;
  }

  // Add status filter if not 'all'
  if (selectedStatus !== 'all') {
    filter.status = parseInt(selectedStatus);
  }

  try {
    // Get the total count of bookings based on the filter
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    // Determine the sort order based on user role
    const sortOrder =
      user.role === 'admin'
        ? [
            {case: {$eq: ['$status', 2]}, then: 0},
            {case: {$eq: ['$status', 3]}, then: 1},
            {case: {$eq: ['$status', 1]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
            {case: {$eq: ['$status', 5]}, then: 4},
          ]
        : [
            {case: {$eq: ['$status', 1]}, then: 0},
            {case: {$eq: ['$status', 2]}, then: 1},
            {case: {$eq: ['$status', 3]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
            {case: {$eq: ['$status', 5]}, then: 4},
          ];

    // Get the bookings based on the filter and pagination
    const bookings = await Booking.aggregate([
      {$match: filter},
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: sortOrder,
              default: 4,
            },
          },
        },
      },
      {$sort: {sortOrder: 1, createdAt: -1}},
      {$skip: skip},
      {$limit: limit},
    ]);

    res.render('manage', {
      userLoggedIn: !!user,
      user: user || null,
      bookings,
      totalPages,
      currentPage: page,
      searchQuery,
      selectedStatus, // Pass the selected status to the template
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res
      .status(500)
      .json({error: 'Failed to load bookings. Please try again later.'});
  }
};
