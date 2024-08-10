const Booking = require('../Models/booking');

module.exports = async (req, res, next) => {
  const id = req.session.userId;
  console.log(id);
  // ตรวจสอบว่า user ไม่ได้ login อยู่หรือไม่
  if (!req.session.user) {
    return res.redirect('/');
  }

  try {
    // ค้นหาข้อมูลการจอง
    const booking = await Booking.findOne({user_id: id, is_locked: true});
    if (booking) {
      console.log(booking);
      booking.is_locked = false;
      await booking.save();
      console.log(`Booking with ID ${booking._id} is now unlocked.`);
    }
    next();
  } catch (error) {
    console.error('Error unlocking booking:', error);
    next(error);
  }
};
