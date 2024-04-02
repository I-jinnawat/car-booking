const Booking = require("../Models/booking");

exports.list = async (req, res) => {
  try {
    req.session.user
      ? res.render("booking", { userLoggedIn: true, user: req.session.user })
      : res.render("booking", { userLoggedIn: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.creatEvent = async (req, res) => {
  try {
    const {
      userinfo,
      organization,
      tel,
      title,
      day,
      start,
      placestart,
      placeend,
      end,
      passenger,
      allDay,
    } = req.body;
    const event = await Booking.create({
      userinfo,
      organization,
      tel,
      title,
      day,
      start,
      placestart,
      placeend,
      end,
      passenger,
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

    if (currentUser.admin) {
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
