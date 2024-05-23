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
      validate: {
        validator: function (v) {
          return /^0\d{9}$/.test(v); // Ensure it starts with 0 and is 10 digits long
        },
        message: `กรอกหมายเลขโทรศัพท์ให้ถูกต้อง`,
      },
    },
    birth_year: {type: String},
  },
  {timestamps: true}
);

const Auth = mongoose.model('Auth', AuthSchema);

module.exports = Auth;
