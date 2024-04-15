const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema(
  {
    category: {type: String, required: true},
    title: {type: String},
    link: {type: String, required: true},
    adminName: {type: String, required: true},
    numberID: {type: Number, required: true},
    organization: {type: String, required: true},
    image: {type: String},
    role: {type: String, required: true},
  },
  {timestamps: true}
);

const Document = mongoose.model('Document', DocSchema);

module.exports = Document;
