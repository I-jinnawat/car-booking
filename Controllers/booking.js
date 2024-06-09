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
      start,
      end,
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

    if (
      deletedPassengerIndex !== undefined &&
      deletedPassengerIndex >= 0 &&
      deletedPassengerIndex < passengers.length
    ) {
      passengers.splice(deletedPassengerIndex, 1);
    }

    const existingBooking = await Booking.findOne({
      status: 2,
      start: currentBooking.start,
    });

    if (
      existingBooking &&
      currentBooking.status === 1 &&
      user.role === 'approver'
    ) {
      return res.render('confirm-approval', {bookingId: id});
    }

    await Booking.findByIdAndUpdate(id, {
      status,
      vehicle,
      mobile_number,
      title,
      start,
      end,
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

    const vehicleInfo = await Vehicle.findOne({
      register: vehicle || currentBooking.vehicle,
    });
    const vehicleID = vehicleInfo._id;
    if (currentBooking.status === 2 && user.role === 'admin') {
      await Vehicle.findByIdAndUpdate(vehicleID, {
        available: 'in_Progress',
      });
    } else if (currentBooking.status === 3) {
      await Vehicle.findByIdAndUpdate(vehicleID, {
        available: 'available',
      });
    }

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
