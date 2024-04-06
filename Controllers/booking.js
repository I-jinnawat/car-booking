const Booking = require("../Models/booking");

exports.list = async (req, res) => {
  const bookings = await Booking.find().lean();
  try {
    req.session.user
      ? res.render("booking", {
          userLoggedIn: true,
          user: req.session.user,
          bookings,
        })
      : res.render("booking", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.bookingEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findById(id);

    req.session.user
      ? res.render("booking-edit", {
          userLoggedIn: true,
          user: req.session.user,
          booking, // Pass the single booking, not an array
        })
      : res.render("dashboard", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      status,
      vehicle,
      userinfo,
      organization,
      mobile_number,
      title,
      start,
      placestart,
      placeend,
      end,
      passenger,
      passengerCount,
      approverName,
      adminName,
      allDay,
    } = req.body;

    const event = await Booking.create({
      status,
      userinfo,
      vehicle,
      organization,
      mobile_number,
      title,
      start,
      placestart,
      placeend,
      end,
      passenger,
      passengerCount,
      approverName,
      adminName,
      allDay,
    });

    res.status(201).redirect("/manage");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.Event = async (req, res) => {
  try {
    const currentUser = req.session.user;
    console.log(currentUser);
    let events;

    if (currentUser.role === "approver" || currentUser.role === "admin") {
      // Admin can see all events with their actual titles
      events = await Booking.find({});
    } else {
      // Regular users can only see events with "booked" as title
      events = await Booking.find({});
      events.forEach((event) => {
        event.title = "ถูกจองแล้วง้าบบ";
      });
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    // Extract the booking data from the request body
    const {
      status,
      mobile_number,
      title,
      start,
      end,
      placestart,
      placeend,
      passengerCount,
      passenger,
    } = req.body;

    // Update the booking in the database
    await Booking.findByIdAndUpdate(id, {
      status,
      mobile_number,
      title,
      start,
      end,
      placestart,
      placeend,
      passengerCount,
      passenger,
    });

    // Redirect the user to a success page or send a success response
    res.redirect("/manage");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the booking by ID and delete it from the database
    await Booking.findByIdAndDelete(id);
    res.sendStatus(204); // Send a success status code (No Content)
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
