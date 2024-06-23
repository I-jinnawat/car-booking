const mongoose = require('mongoose');

const manualSchema = mongoose.Schema(
  {
    title: {type: String},
    file: {type: String},
    link: {type: String},
  },
  {timestamps: true}
);

const manual = mongoose.model('manual', manualSchema);

module.exports = manual;
