const Booking = require('../Models/booking');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1); // Ensure page is a positive integer
  const limit = 8;
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

    // Get the bookings based on the filter and pagination
    const bookings = await Booking.find(filter)
      .sort({status: 1, createdAt: -1})
      .skip(skip)
      .limit(limit)
      .lean();

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
