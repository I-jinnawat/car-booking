const express = require("express");
const router = express.Router();

const {
  list,
  Event,
  createEvent,
  bookingEdit,
} = require("../Controllers/booking");

router.get("/booking", list);
router.get("/booking-edit/:id", bookingEdit);
router.get("/events", Event);
router.post("/events", createEvent);

module.exports = router;
