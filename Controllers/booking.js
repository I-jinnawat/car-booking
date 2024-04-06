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

exports.createEvent = async (req, res) => {
  try {
    const {
      status,
      vehicle,
      userinfo,
      organization,
      mobile_number,
      title,
      day,
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
      status, // Include the status field
      userinfo,
      vehicle,
      organization,
      mobile_number,
      title,
      day,
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

    res.status(201).redirect("/");
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
exports.bookingEdit = async (req, res) => {
  const bookings = await Booking.find().lean();
  try {
    req.session.user
      ? res.render("booking-edit", {
          userLoggedIn: true,
          user: req.session.user,
          bookings,
        })
      : res.render("booking-edit", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
