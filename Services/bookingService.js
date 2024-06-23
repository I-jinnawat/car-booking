const Booking = require('../Models/booking');

async function getCountOfBookings(date) {
  try {
    // แปลงวันที่ให้เป็นรูปแบบที่เริ่มต้นจากเวลา 00:00:00 และสิ้นสุดที่เวลา 23:59:59 ของวันเดียวกัน
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ค้นหาการจองที่มีวันที่เริ่มต้นหรือสิ้นสุดในวันที่กำหนด และมีสถานะ <= 4
    const totalBookings = await Booking.countDocuments({
      $and: [
        {status: {$gte: 2, $lt: 4}},
        {
          $or: [
            {start: {$gte: startOfDay, $lte: endOfDay}}, // เริ่มต้นในวันนี้
            {end: {$gte: startOfDay, $lte: endOfDay}}, // สิ้นสุดในวันนี้
          ],
        },
      ],
    });

    return totalBookings;
  } catch (error) {
    console.error('Error fetching count of bookings:', error);
    throw error;
  }
}

module.exports = {
  getCountOfBookings,
};
