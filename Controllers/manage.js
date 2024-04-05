const Booking = require("../Models/booking");

exports.list = async (req, res) => {
  const bookings = await Booking.find().lean();
  try {
    req.session.user
      ? res.render("manage", {
          userLoggedIn: true,
          user: req.session.user,
          bookings,
        })
      : res.render("manage", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
