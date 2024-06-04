const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    numberID: {type: Number, required: true, unique: true},
    organization: {type: String, required: true},
    role: {type: String, required: true},
    mobile_number: {
      type: String,
      required: true,
    },
    birth_year: {type: String},
  },
  {timestamps: true}
);

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
