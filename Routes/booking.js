const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  list,
  Event,
  createEvent,
  confirmBooking,
  bookingEdit,
  updateEvent,
  deleteEvent,
} = require('../Controllers/booking');

router.get('/booking', auth, list);
router.get('/booking-edit/:id', auth, bookingEdit);
router.get('/events', auth, Event);
router.post('/events', auth, createEvent);
router.post('/events/:id', updateEvent);
router.post('/events/confirm/:id', confirmBooking);
router.delete('/events/:id', auth, deleteEvent);
module.exports = router;
