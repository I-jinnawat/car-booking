const mongoose = require("mongoose");
const moment = require("moment-timezone");

const eventSchema = new mongoose.Schema(
  {
    status: { type: Number, required: true, default: 1 },
    vehicle: { type: String },
    userinfo: { type: String, required: true },
    organization: { type: String, required: true },
    mobile_number: { type: Number, required: true },
    title: { type: String, required: true },
    day: { type: Date, required: true },
    start: { type: Date, required: true },
    placestart: { type: String, required: true },
    placeend: { type: String, required: true },
    end: { type: Date, required: true },
    passengerCount: { type: Number, required: true },
    passenger: { type: String, required: true },
    approverName: { type: String },
    adminName: { type: String },
    allDay: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Define a pre-save hook to convert start and end timestamps to Thai time zone
eventSchema.pre("save", function (next) {
  const thaiTimeZone = "Asia/Bangkok";
  // Convert start and end timestamps to Thai time zone
  if (this.start) {
    this.start = moment(this.start).tz(thaiTimeZone);
  }
  if (this.end) {
    this.end = moment(this.end).tz(thaiTimeZone);
  }
  next();
});

const Booking = mongoose.model("book", eventSchema);

module.exports = Booking;
