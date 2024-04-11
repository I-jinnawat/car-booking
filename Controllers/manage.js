const Booking = require('../Models/booking');

exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const totalBookings = await Booking.countDocuments();
    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find().skip(skip).limit(limit).lean();

    req.session.user
      ? res.render('manage', {
          userLoggedIn: true,
          user: req.session.user,
          bookings,
          totalPages,
          currentPage: parseInt(page),
        })
      : res.render('manage', {userLoggedIn: false});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
