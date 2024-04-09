const vehicle = require("../Models/vehicles");

async function getCountOfVehicles() {
  try {
    const totalVehicles = await vehicle.countDocuments();

    return totalVehicles;
  } catch (e) {
    console.error("Error fetching count of bookings:", e);
    throw e;
  }
}
module.exports = {
  getCountOfVehicles,
};
