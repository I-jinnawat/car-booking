const {getCountOfBookings} = require('../Services/bookingService');
const {
  getCountOfVehicles,
  getCountOfVehiclesInProgress,
} = require('../Services/vehicleService');

const Vehicle = require('../Models/vehicles');

exports.read = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date and time
    const currentDay = currentDate.toISOString().split('T')[0]; // Extract the date part in YYYY-MM-DD format

    const bookingCount = await getCountOfBookings(currentDay); // Pass the current date to get booking count
    const vehicleCount = await getCountOfVehicles();
    const vehicleInProgress = await getCountOfVehiclesInProgress(currentDay);

    const vehicles = await Vehicle.find().lean();

    if (
      req.session.user.role === 'user' ||
      req.session.user.role === 'driver' ||
      req.session.user.role === 'approver'
    ) {
      res.redirect('/manage');
    } else {
      res.render('dashboard', {
        userLoggedIn: !!req.session.user,
        user: req.session.user || null,
        bookingCount: bookingCount,
        vehicleCount: vehicleCount,
        vehicleInProgress: vehicleInProgress,
        vehicles,
      });
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).render('error', {message: 'Internal Server Error'});
  }
};
