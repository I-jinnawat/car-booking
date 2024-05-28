const {getCountOfBookings} = require('../Services/bookingService');
const {getCountOfVehicles} = require('../Services/vehicleService');
const Vehicle = require('../Models/vehicles');
exports.read = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const currentDay = currentDate.toISOString().split('T')[0]; // Extract the day part from the ISO string representation

    const bookingCount = await getCountOfBookings(currentDay); // Use adjusted current date here
    const vehicleCount = await getCountOfVehicles();
    console.log('Vehicle Count:', vehicleCount);
    const vehicles = await Vehicle.find().lean();

    if (req.session.user) {
      res.render('dashboard', {
        userLoggedIn: true,
        user: req.session.user,
        bookingCount: bookingCount,
        vehicleCount: vehicleCount,
        vehicles,
      });
    } else {
      res.render('dashboard', {
        userLoggedIn: false,
        bookingCount: bookingCount,
        vehicleCount: vehicleCount,
        vehicles,
      });
      // res.send(vehicleCount);
    }
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {message: 'Internal Server Error'});
  }
};
