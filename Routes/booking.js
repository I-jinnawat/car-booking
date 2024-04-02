const express = require("express");
const router = express.Router();

const { list, creatEvent, Event } = require("../Controllers/booking");

router.get("/booking", list);
router.get("/events", Event);
router.post("/events", creatEvent);

module.exports = router;
