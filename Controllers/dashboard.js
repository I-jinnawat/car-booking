const { getCountOfBookings } = require("../Services/bookingService");
const { getCountOfVehicles } = require("../Services/vehicleService");

exports.read = async (req, res) => {
  try {
    const bookingCount = await getCountOfBookings();
    const vehicleCount = await getCountOfVehicles();
    if (req.session.user) {
      res.render("dashboard", {
        userLoggedIn: true,
        user: req.session.user,
        bookingCount: bookingCount,
        vehicleCount: vehicleCount,
      });
    } else {
      res.render("dashboard", {
        userLoggedIn: false,
        bookingCount: bookingCount,
        vehicleCount: vehicleCount,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
};
