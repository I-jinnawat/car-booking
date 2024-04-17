const {getCountOfBookings} = require('../Services/bookingService');
const {getCountOfVehicles} = require('../Services/vehicleService');
const Vehicle = require('../Models/vehicles');
exports.read = async (req, res) => {
  try {
    const bookingCount = await getCountOfBookings();
    const vehicleCount = await getCountOfVehicles();
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
    }
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {message: 'Internal Server Error'});
  }
};
