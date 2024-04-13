const moment = require('moment-timezone');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    status: {type: Number, required: true, default: 1},
    vehicle: {type: String},
    userinfo: {type: String, required: true},
    user_id: {type: String, require: true},
    organization: {type: String, required: true},
    mobile_number: {type: String, required: true},
    title: {type: String, required: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    placestart: {type: String, required: true},
    placeend: {type: String, required: true},
    passengerCount: {type: Number, required: true},
    passengers: [{}],
    approverName: {type: String},
    note: {type: String},
    adminName: {type: String},
    cancelerName: {type: String},
    driver: {type: String},
    kilometer_start: {type: Number},
    kilometer_end: {type: Number},
    total_kilometer: {type: Number},
    allDay: {type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

// Define a pre-save hook to convert start and end timestamps to Thai time zone
eventSchema.pre('save', function (next) {
  const thaiTimeZone = 'Asia/Bangkok';
  // Convert start and end timestamps to Thai time zone
  if (this.start) {
    this.start = moment(this.start).tz(thaiTimeZone);
  }
  if (this.end) {
    this.end = moment(this.end).tz(thaiTimeZone);
  }
  next();
});

const Booking = mongoose.model('book', eventSchema);

module.exports = Booking;
