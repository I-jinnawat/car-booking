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
    const vehicle = await Vehicle.find({available: true});
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

    req.session.user
      ? res.render('booking-edit', {
          userLoggedIn: true,
          user: req.session.user,
          booking,
          bookingStatus,
          drivers,
          vehicle,
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
    console.log(currentUser);
    let events;

    if (currentUser.role === 'approver' || currentUser.role === 'admin') {
      // Admin can see all events with their actual titles
      events = await Booking.find({});
    } else {
      // Regular users can only see events with "booked" as title
      events = await Booking.find({});
      events.forEach(event => {
        event.title = 'ถูกจองแล้ว';
      });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

exports.updateEvent = async (req, res) => {
  const {id} = req.params;

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
      approverName,
      note,
      cancelerName,
      kilometer_start,
      kilometer_end,
      total_kilometer,
      deletedPassengerIndex,
    } = req.body;
    if (
      deletedPassengerIndex !== undefined &&
      deletedPassengerIndex >= 0 &&
      deletedPassengerIndex < passengers.length
    ) {
      // Remove the passenger at the specified index from the passengers array
      passengers.splice(deletedPassengerIndex, 1);
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
      approverName,
      note,
      cancelerName,
      kilometer_start,
      kilometer_end,
      total_kilometer,
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
