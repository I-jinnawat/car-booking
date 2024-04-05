const express = require("express");
const router = express.Router();

const { list, createEvent, Event } = require("../Controllers/booking");

router.get("/booking", list);
router.get("/events", Event);
router.post("/events", createEvent);

module.exports = router;
