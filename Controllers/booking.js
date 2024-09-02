const Booking = require('../Models/booking');
const User = require('../Models/Auth');
const Vehicle = require('../Models/vehicles');
const Counter = require('../Models/Counter');
async function initializeCounter(year) {
  let counter = await Counter.findOne({year});
  if (!counter) {
    counter = new Counter({year, count: 0});
    await counter.save();
  }
}

initializeCounter(new Date().getFullYear());

exports.list = async (req, res, next) => {
  try {
    const bookings = await Booking.find().lean();
    const id = req.session.user.id;
    const user = await User.findById(id);

    res.render('booking', {
      userLoggedIn: Boolean(req.session.user),
      user,
      bookings,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//Display booking-edit Page
exports.bookingEdit = async (req, res, next) => {
  const {id} = req.params;

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).redirect('/manage');
    }

    const [drivers, vehicles, vehicle] = await Promise.all([
      User.find({role: 'driver'}),
      Vehicle.find({available: 'available'}),
      Vehicle.findOne({register: booking.vehicle}),
    ]);

    if (
      booking.user_id === req.session.userId &&
      req.session.user.role !== 'approver' &&
      booking.user_id === req.session.userId &&
      booking.status === 1
    ) {
      booking.is_locked = true;
      await booking.save();
      console.log(`Booking with ID ${booking._id} has locked`);
      // ตั้ง Timer เพื่อล็อกเวลา เช่น 5 นาที (300000 มิลลิวินาที)
      setTimeout(async () => {
        booking.is_locked = false;
        await booking.save();
        console.log(
          `Booking with ID ${booking._id} has been unlocked after 5 minutes.`
        );
      }, 60000); // 300000 มิลลิวินาที = 5 นาที
    }

    const bookingStatus = booking.status;
    const errorBooking = req.flash('errorBooking');
    const start = new Date(booking.start.getTime() + 7 * 60 * 60 * 1000);
    const end = new Date(booking.end.getTime() + 7 * 60 * 60 * 1000);

    res.render('booking-edit', {
      userLoggedIn: Boolean(req.session.user),
      user: req.session.user,
      booking,
      start,
      end,
      bookingStatus,
      drivers,
      vehicles,
      errorBooking,
      vehicle,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
      {year: currentYear},
      {$inc: {count: 1}},
      {new: true, upsert: true}
    );

    const bookingID = `${currentYear}-${counter.count}`;
    req.body.bookingID = bookingID;

    await Booking.create(req.body);
    res.status(201).redirect('/manage');
  } catch (error) {
    console.error('Error creating booking:', error);
    next(error);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const {id} = req.params;
    const currentBooking = await Booking.findById(id);
    const user = await User.findById(req.session.user.id);

    const {
      is_locked,
      status,
      vehicle_id,
      mobile_number,
      title,
      placestart,
      placeend,
      compensation_payment,
      passengerCount,
      passengers,
      start,
      end,
      driver_id,
      adminApprove,
      adminApproveName,
      adminApprove_Time,
      adminName,
      carArrange_Time,
      approverName,
      note,
      cancelerName,
      approve_Time,
      kilometer_start,
      kilometer_end,
      total_kilometer,
      completion_Time,
      deletedPassengerIndex,
    } = req.body;
    let driverName = null;
    let driver = null;
    let vehicle_register = null;
    let vehicle = null;
    if (currentBooking.is_locked && user.role === 'approver') {
      req.flash(
        'errorBooking',
        'ไม่สามารถอนุมัติได้ เนื่องจากการจองกำลังถูกแก้ไข'
      );
      return res.redirect(`/booking-edit/${id}`);
    }

    if (vehicle_id) {
      vehicle = await Vehicle.findById(vehicle_id);

      vehicle_register = vehicle.register;
    }
    // Check if booking is approved and user is trying to modify it
    if (currentBooking.status === 2 && currentBooking.user_id === user._id) {
      req.flash(
        'errorBooking',
        'ไม่สามารถแก้ไขได้ เนื่องจากการจองถูกอนุมัติแล้ว'
      );
      return res.redirect(`/booking-edit/${id}`);
    }
    if (
      (currentBooking.status <= 4 && currentBooking.status >= 2 && driver_id) ||
      currentBooking.driver_id
    ) {
      driver = await User.findById(driver_id || currentBooking.driver_id);
      driverName = driver.firstname + ' ' + driver.lastname;
    }
    if (cancelerName && note) {
      currentBooking.driver = null;
      currentBooking.adminName = null;
      currentBooking.carArrange_Time = null;
      currentBooking.driver_id = null;
      currentBooking.vehicle_id = null;
      await currentBooking.save();
    }
    if (
      currentBooking.status === 3 &&
      user.role === 'admin' &&
      !(kilometer_start || kilometer_end)
    ) {
      currentBooking.driver_id = driver._id;
      currentBooking.driver = driverName;
      currentBooking.vehicle = vehicle;
      await currentBooking.save();
    }
    // Update kilometer information if booking status is 3
    if (kilometer_start && kilometer_end) {
      currentBooking.kilometer_start = kilometer_start;
      currentBooking.kilometer_end = kilometer_end;
      currentBooking.vehicle = vehicle;
      await currentBooking.save();
    }

    // Remove passenger if specified
    if (
      deletedPassengerIndex !== undefined &&
      deletedPassengerIndex >= 0 &&
      deletedPassengerIndex < passengers.length
    ) {
      passengers.splice(deletedPassengerIndex, 1);
    }

    // Find overlapping bookings
    const existingBooking = await Booking.findOne({
      status: 2,
      start: currentBooking.start,
    });

    // Handle approval confirmation
    if (
      existingBooking &&
      currentBooking.status === 1 &&
      user.role === 'approver'
    ) {
      return res.render('confirm-approval', {bookingId: id});
    }

    let vehicleInfo;
    if (
      currentBooking.status <= 4 &&
      currentBooking.status >= 3 &&
      currentBooking.adminApprove
    ) {
      vehicleInfo = await Vehicle.findById(
        vehicle_id || currentBooking.vehicle_id
      );
      if (vehicleInfo) {
        let last_distance = vehicleInfo.last_distance || 0;

        if (currentBooking.status === 2 && user.role !== 'approver') {
          vehicleInfo.start_time = currentBooking.start;
          vehicleInfo.end_time = currentBooking.end;
          await vehicleInfo.save();
        } else if (
          currentBooking.status === 3 &&
          user.role !== 'approver' &&
          kilometer_end
        ) {
          vehicleInfo.start_time = null;
          vehicleInfo.end_time = null;
          last_distance = parseFloat(kilometer_end);
          vehicleInfo.last_distance = last_distance;
          await vehicleInfo.save();
        }
      } else {
        console.error('Vehicle information not found');
        return res.status(404).send('Vehicle information not found');
      }
    }

    // Update booking with new information
    await Booking.findByIdAndUpdate(id, {
      is_locked,
      status,
      vehicle: vehicle_register,
      vehicle_id,
      mobile_number,
      title,
      placestart,
      placeend,
      compensation_payment,
      passengerCount,
      passengers,
      start,
      end,
      driver_id,
      driver: driverName,
      adminApprove,
      adminApproveName,
      adminApprove_Time,
      adminName,
      carArrange_Time,
      approverName,
      note,
      cancelerName,
      approve_Time,
      kilometer_start,
      kilometer_end,
      total_kilometer,
      completion_Time,
    });

    res.redirect('/manage');
  } catch (error) {
    console.error('Error' + error);
    next(error);
  }
};
exports.Event = async (req, res, next) => {
  try {
    const currentUser = req.session.user;

    if (!currentUser) {
      return res.status(401).json({message: 'User not authenticated'});
    }

    let events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean();

    events = events.map(event => ({
      ...event,
      title:
        (currentUser.role === 'approver' || currentUser.role === 'admin') &&
        currentUser !== null
          ? event.title
          : 'ถูกจองแล้ว',
    }));

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    next(error);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {status} = req.body;

    if (status !== 6) {
      return res.status(400).send('Invalid status');
    }
    await Booking.findByIdAndUpdate(id, {status});
    res.status(200).redirect('/manage');
  } catch (e) {}
};
exports.deleteEvent = async (req, res, next) => {
  const {id} = req.params;
  try {
    await Booking.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting booking:', error);
    next(error);
  }
};

exports.confirmBooking = async (req, res, next) => {
  const {id} = req.params;
  const user = req.session.user;

  try {
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    booking.status = 2;
    booking.approverName = `${user.firstname} ${user.lastname}`;
    booking.approve_Time = new Date().toISOString();
    await booking.save();

    res.redirect('/manage');
  } catch (error) {
    console.error(error);
    next(error);
  }
};
