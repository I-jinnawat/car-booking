const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema(
  {
    category: {type: String, required: true},
    title: {type: String}, // Assuming this is optional
    link: {type: String, required: true},
    adminName: {type: String, required: true},
    numberID: {type: Number, required: true}, // Fixed typo
    organization: {type: String, required: true}, // Fixed typo
    role: {type: String, required: true}, // Fixed typo
  },
  {timestamps: true}
);

const Document = mongoose.model('Document', DocSchema);

module.exports = Document;
