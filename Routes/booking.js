const express = require("express");
const router = express.Router();

const {
  list,
  Event,
  createEvent,
  bookingEdit,
  updateEvent,
  deleteEvent,
} = require("../Controllers/booking");

router.get("/booking", list);
router.get("/booking-edit/:id", bookingEdit);
router.get("/events", Event);
router.post("/events/:id", updateEvent);
router.post("/events", createEvent);
router.delete("/events/:id", deleteEvent);
module.exports = router;
