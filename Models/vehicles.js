const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
  {
    register: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    seat: {type: Number, require: true},
    available: {type: Boolean, require: true, default: true},
  },
  {timestamps: true}
);

const vehicles = mongoose.model('vehicles', CarSchema);

module.exports = vehicles;
