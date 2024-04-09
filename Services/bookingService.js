const Booking = require("../Models/booking");

async function getCountOfBookings() {
  try {
    const totalBookings = await Booking.countDocuments();

    return totalBookings;
  } catch (error) {
    console.error("Error fetching count of bookings:", error);
    throw error;
  }
}
module.exports = {
  getCountOfBookings,
};
