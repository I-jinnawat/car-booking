const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    status: { type: Number, rquire: true },
    vehicle: { type: String, require: true },
    userinfo: { type: String, required: true },
    organization: { type: String, required: true },
    tel: { type: Number, require: true },
    title: { type: String, require: true },
    day: { type: Date, required: true },
    start: { type: Date, required: true },
    placestart: { type: String, require: true },
    placeend: { type: String, require: true },
    end: { type: Date, require: true },
    passengerCount: { type: Number, require: true },
    passenger: { type: String, require: true },
    allDay: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("book", eventSchema);

module.exports = Booking;
