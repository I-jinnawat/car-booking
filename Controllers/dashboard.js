const {getCountOfBookings} = require('../Services/bookingService');
const {
  getCountOfVehicles,
  getCountOfVehiclesInProgress,
} = require('../Services/vehicleService');

const Vehicle = require('../Models/vehicles');

exports.read = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const currentDay = currentDate.toISOString().split('T')[0]; // Extract the day part from the ISO string representation

    const bookingCount = await getCountOfBookings(currentDay); // Use adjusted current date here
    const vehicleCount = await getCountOfVehicles();
    const vehicleInProgress = await getCountOfVehiclesInProgress(currentDay);

    console.log('Vehicle Count:', vehicleCount);

    const vehicles = await Vehicle.find().lean();

    res.render('dashboard', {
      userLoggedIn: !!req.session.user,
      user: req.session.user || null,
      bookingCount: bookingCount,
      vehicleCount: vehicleCount,
      vehicleInProgress: vehicleInProgress,
      vehicles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {message: 'Internal Server Error'});
  }
};
