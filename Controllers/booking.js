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
      return (
        res
          .status(404)
          // .json({error: 'Booking not found'})
          .redirect('/manage')
      );
    }

    // Pass booking status to the frontend
    const bookingStatus = booking.status;
    const errorBooking = req.flash('errorBooking');
    req.session.user
      ? res.render('booking-edit', {
          userLoggedIn: true,
          user: req.session.user,
          booking,
          bookingStatus,
          drivers,
          vehicle,
          errorBooking: errorBooking,
        })
      : res.render('dashboard', {userLoggedIn: false});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.createEvent = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Get or initialize the counter for the current year
    let counter = await Counter.findOneAndUpdate(
      {year: currentYear},
      {$inc: {count: 1}},
      {new: true, upsert: true}
    );

    // Construct the booking ID
    const bookingID = `${currentYear}-${counter.count}`;

    // Add the booking ID to the request body
    req.body.bookingID = bookingID;

    const status = req.body.status;

    // Create the booking in the database
    const event = await Booking.create(req.body);

    res.status(201).redirect('/manage');
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};

exports.Event = async (req, res) => {
  try {
    const currentUser = req.session.user;

    let events;

    if (currentUser.role === 'approver' || currentUser.role === 'admin') {
      // Admin and approvers can see all events with their actual titles
      events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean();
    } else {
      // Regular users can only see events with status >= 2 and < 4, and "booked" as title
      events = await Booking.find({status: {$gte: 2, $lt: 4}}).lean(); // Ensure status >= 2 and < 4
      events = events.map(event => ({...event, title: 'ถูกจองแล้ว'}));
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({error: error.message});
  }
};

exports.updateEvent = async (req, res) => {
  const {id} = req.params;
  const currentBooking = await Booking.findById(id);
  const user = req.session.user;

  try {
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
      check,
    } = req.body;

    if (
      deletedPassengerIndex !== undefined &&
      deletedPassengerIndex >= 0 &&
      deletedPassengerIndex < passengers.length
    ) {
      passengers.splice(deletedPassengerIndex, 1);
    }

    const existingDate = currentBooking.start;
    const existingBooking = await Booking.findOne({
      status: 2,
      start: existingDate,
    });

    if (existingBooking && currentBooking.status === 1) {
      // Render a page with SweetAlert to ask for confirmation
      res.render('confirm-approval', {bookingId: id});
      return;
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
    // Ensure user is authenticated
    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // Find the booking to be approved
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    // Update the booking status to approved
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
