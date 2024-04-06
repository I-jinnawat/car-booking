const { getCountOfBookings } = require("../Services/bookingService");

exports.read = async (req, res) => {
  try {
    const bookingCount = await getCountOfBookings();
    if (req.session.user) {
      res.render("dashboard", {
        userLoggedIn: true,
        user: req.session.user,
        bookingCount: bookingCount, // Pass bookingCount here
      });
    } else {
      // If user is not logged in, render dashboard without user information
      res.render("dashboard", {
        userLoggedIn: false,
        bookingCount: bookingCount, // Pass bookingCount here
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("error", { message: "Internal Server Error tesssssssssss" });
  }
};
