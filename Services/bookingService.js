const Booking = require("../Models/booking");

// Function to fetch the count of bookings from the database
async function getCountOfBookings() {
  try {
    // Execute a query to count the number of bookings
    const totalBookings = await Booking.countDocuments();

    return totalBookings;
  } catch (error) {
    // Handle any errors that occur during database query
    console.error("Error fetching count of bookings:", error);
    throw error;
  }
}

// Export the functions to be used in other parts of the application
module.exports = {
  getCountOfBookings,
};
