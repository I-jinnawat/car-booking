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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ค้นหาการจองที่มีวันที่เริ่มต้นหรือสิ้นสุดในวันที่กำหนด และมีสถานะ <= 4
    const totalvehicleInprogress = await vehicle.countDocuments({
      $or: [
        {start_time: {$gte: startOfDay, $lte: endOfDay}}, // เริ่มต้นในวันนี้
        {end_time: {$gte: startOfDay, $lte: endOfDay}}, // สิ้นสุดในวันนี้
      ],
    });

    return totalvehicleInprogress;
  } catch (error) {
    console.error('Error fetching count of vehicles in progress:', error);
    throw error;
  }
}

module.exports = {
  getCountOfVehicles,
  getCountOfVehiclesInProgress,
};
