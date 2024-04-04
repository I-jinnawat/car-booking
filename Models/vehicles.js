const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    register: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    color: { type: String, require: true },
    seat: { type: Number, require: true },
    available: { type: Boolean, require: true },
  },
  { timestamps: true }
);

const vehicles = mongoose.model("vehicles", CarSchema);

module.exports = vehicles;
