const Booking = require('../Models/booking');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is a positive integer
  const singlePageLimit = 8; // The original limit for a single page
  const limit = singlePageLimit * 2; // Double the limit to cover two pages
  const skip = (page - 1) * limit;

  const user = req.session.user;

  // Determine the query filter based on user role
  let filter = {};
  if (user.role === 'user') {
    filter = {user_id: user.id};
  }

  try {
    // Get the total count of bookings based on the filter
    const totalBookings = await Booking.countDocuments(filter);
    const totalPages = Math.ceil(totalBookings / limit);

    // Determine the sort order based on user role
    let sortOrder;
    if (user.role === 'admin') {
      sortOrder = {
        $switch: {
          branches: [
            {case: {$eq: ['$status', 2]}, then: 0},
            {case: {$eq: ['$status', 3]}, then: 1},
            {case: {$eq: ['$status', 1]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
          ],
          default: 4,
        },
      };
    } else {
      sortOrder = {
        $switch: {
          branches: [
            {case: {$eq: ['$status', 1]}, then: 0},
            {case: {$eq: ['$status', 2]}, then: 1},
            {case: {$eq: ['$status', 3]}, then: 2},
            {case: {$eq: ['$status', 4]}, then: 3},
          ],
          default: 4,
        },
      };
    }

    // Get the bookings based on the filter and pagination
    const bookings = await Booking.aggregate([
      {$match: filter},
      {$addFields: {sortOrder: sortOrder}},
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
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res
      .status(500)
      .json({error: 'Failed to load bookings. Please try again later.'});
  }
};
