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

exports.list = async (req, res) => {
  const bookings = await Booking.find().lean();
  const id = req.session.user.id;
  const user = await User.findById(id);
  try {
    req.session.user
      ? res.render('booking', {
          userLoggedIn: true,
          user: user,
          bookings,
        })
      : res.render('booking', {userLoggedIn: false});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.bookingEdit = async (req, res) => {
  const {id} = req.params;
  try {
    const booking = await Booking.findById(id);
    const drivers = await User.find({role: 'driver'});
    const vehicle = await Vehicle.find({available: 'available'});

    if (!booking) {
      return res.status(404).redirect('/manage');
    }

    const bookingStatus = booking.status;
    const errorBooking = req.flash('errorBooking');

    res.render('booking-edit', {
      userLoggedIn: !!req.session.user,
      user: req.session.user,
      booking,
      bookingStatus,
      drivers,
      vehicle,
      errorBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.createEvent = async (req, res) => {
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
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.updateEvent = async (req, res) => {
  const {id} = req.params;

  try {
    const currentBooking = await Booking.findById(id);

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
      currentBooking.role === 'approver'
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

    res.redirect('/manage');
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.Event = async (req, res) => {
  try {
    const currentUser = req.session.user;
    let events;

    if (currentUser.role === 'approver' || currentUser.role === 'admin') {
      events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean();
    } else {
      events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean();
      events = events.map(event => ({...event, title: 'ถูกจองแล้ว'}));
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.deleteEvent = async (req, res) => {
  const {id} = req.params;

  try {
    await Booking.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.confirmBooking = async (req, res) => {
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
    res.status(500).json({error: 'Internal Server Error'});
  }
};
