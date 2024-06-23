const {time} = require('console');
const moment = require('moment-timezone');
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
    birth_year: {type: Date},
  },
  {timestamps: true}
);

AuthSchema.pre('save', function (next) {
  const thaiTimeZone = 'Asia/Bangkok';
  if (this.birth_year) {
    this.birth_year = moment(this.birth_year).tz(thaiTimeZone).toDate();
  }

  next();
});
const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
