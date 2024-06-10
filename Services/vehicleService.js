const vehicle = require('../Models/vehicles');

async function getCountOfVehicles() {
  try {
    const totalVehicles = await vehicle.countDocuments();
    return totalVehicles;
  } catch (e) {
    console.error('Error fetching count of vehicles:', e);
    throw e;
  }
}

async function getCountOfVehiclesInProgress(date) {
  try {
    const totalVehiclesInProgress = await vehicle.countDocuments({
      available: 'in_progress',
    });

    return totalVehiclesInProgress;
  } catch (error) {
    console.error('Error fetching count of vehicles in progress:', error);
    throw error;
  }
}

module.exports = {
  getCountOfVehicles,
  getCountOfVehiclesInProgress,
};
