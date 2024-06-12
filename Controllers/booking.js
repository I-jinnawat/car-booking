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

exports.bookingEdit = async (req, res, next) => {
  const {id} = req.params;
  try {
    const [booking, drivers, vehicles] = await Promise.all([
      Booking.findById(id),
      User.find({role: 'driver'}),
      Vehicle.find({available: 'available'}),
    ]);
    const vehicle = await Vehicle.findOne({register: booking.vehicle});

    if (!booking) {
      return res.status(404).redirect('/manage');
    }

    const bookingStatus = booking.status;
    const errorBooking = req.flash('errorBooking');

    res.render('booking-edit', {
      userLoggedIn: Boolean(req.session.user),
      user: req.session.user,
      booking,
      bookingStatus,
      drivers,
      vehicles,
      errorBooking,
      vehicle: vehicle,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();

    let counter = await Counter.findOneAndUpdate(
      {year: currentYear},
      {$inc: {count: 1}},
      {new: true, upsert: true}
    );

    const bookingID = `${currentYear}-${counter.count}`;
    req.body.bookingID = bookingID;

    // Convert start and end times to UTC
    if (req.body.start && req.body.end) {
      // Convert start and end to JavaScript Date objects
      const start = new Date(
        new Date(req.body.start).getTime() + 7 * 60 * 60 * 1000
      );
      const end = new Date(
        new Date(req.body.end).getTime() + 7 * 60 * 60 * 1000
      );

      req.body.start = start;
      req.body.end = end;
    }

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
      status,
      vehicle,
      mobile_number,
      title,
      placestart,
      placeend,
      passengerCount,
      passengers,
      driver,
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

    // Convert start and end to JavaScript Date objects
    const startTime = new Date(
      new Date(req.body.start).getTime() + 7 * 60 * 60 * 1000
    );
    const endTime = new Date(
      new Date(req.body.end).getTime() + 7 * 60 * 60 * 1000
    );

    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(400).send('Invalid start or end time');
    }

    // ตรวจสอบดัชนีของ passenger ที่จะลบ
    if (
      deletedPassengerIndex !== undefined &&
      deletedPassengerIndex >= 0 &&
      deletedPassengerIndex < passengers.length
    ) {
      passengers.splice(deletedPassengerIndex, 1);
    }

    // ค้นหา Booking ที่ทับซ้อนกัน
    const existingBooking = await Booking.findOne({
      status: 2,
      start: currentBooking.start,
    });

    // ตรวจสอบการอนุมัติ
    if (
      existingBooking &&
      currentBooking.status === 1 &&
      user.role === 'approver'
    ) {
      return res.render('confirm-approval', {bookingId: id});
    }

    // ค้นหาข้อมูล Vehicle
    let vehicleInfo;
    if (currentBooking.status !== 1 && currentBooking.status <= 4) {
      vehicleInfo = await Vehicle.findOne({
        register: vehicle || currentBooking.vehicle,
      });

      if (vehicleInfo) {
        let last_distance = vehicleInfo.last_distance || 0;
        let start_time = vehicleInfo.start_time || null;
        let end_time = vehicleInfo.end_time || null;

        if (currentBooking.status === 2 && user.role !== 'approver') {
          vehicleInfo.start_time = currentBooking.start;
          vehicleInfo.end_time = currentBooking.end;
          await vehicleInfo.save();
        } else if (currentBooking.status === 3 && user.role !== 'approver') {
          vehicleInfo.start_time = '';
          vehicleInfo.end_time = '';
          last_distance += parseFloat(total_kilometer);
          console.log('New last_distance:', last_distance);
          vehicleInfo.last_distance = last_distance;
          await vehicleInfo.save();
          console.log(vehicleInfo.start_time);
          console.log(vehicleInfo.end_time);
        }
      } else {
        // Handle the case where vehicleInfo is not found
        console.error('Vehicle information not found');
        return res.status(404).send('Vehicle information not found');
      }
    }

    // อัปเดตข้อมูลการจอง
    await Booking.findByIdAndUpdate(id, {
      status,
      vehicle,
      mobile_number,
      title,
      start: startTime,
      end: endTime,
      placestart,
      placeend,
      passengerCount,
      passengers,
      driver,
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
    console.error(error);
    next(error);
  }
};

exports.Event = async (req, res, next) => {
  try {
    const currentUser = req.session.user;
    let events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean();

    if (!(currentUser.role === 'approver' || currentUser.role === 'admin')) {
      events = events.map(event => ({...event, title: 'ถูกจองแล้ว'}));
    }

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
