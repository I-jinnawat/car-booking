const moment = require('moment-timezone');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    bookingID: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
      default: 1,
    },
    vehicle: {type: String},
    userinfo: {type: String, required: true},
    user_id: {type: String, required: true},
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
  if (this.start) {
    this.start = moment(this.start).tz(thaiTimeZone).toDate();
  }
  if (this.end) {
    this.end = moment(this.end).tz(thaiTimeZone).toDate();
  }
  next();
});

const Booking = mongoose.model('book', eventSchema);

module.exports = Booking;
