const Booking = require("../Models/booking");

exports.list = async (req, res) => {
  const page = req.query.page || 1; // Get the current page number from the query string, default to 1 if not provided
  const limit = 10; // Number of items per page
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  try {
    const totalBookings = await Booking.countDocuments();
    const totalPages = Math.ceil(totalBookings / limit);

    const bookings = await Booking.find().skip(skip).limit(limit).lean();

    req.session.user
      ? res.render("manage", {
          userLoggedIn: true,
          user: req.session.user,
          bookings,
          totalPages,
          currentPage: parseInt(page),
        })
      : res.render("manage", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
