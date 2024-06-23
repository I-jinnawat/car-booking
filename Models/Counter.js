const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  year: Number,
  count: Number,
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
