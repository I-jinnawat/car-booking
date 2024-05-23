const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema(
  {
    category: {type: String, required: true},
    title: {type: String},
    file: {type: String},
    adminName: {type: String, required: true},
    numberID: {type: Number, required: true},
    organization: {type: String, required: true},
    image: {type: String, require: true},
    role: {type: String, required: true},
  },
  {timestamps: true}
);

const Document = mongoose.model('Document', DocSchema);

module.exports = Document;
