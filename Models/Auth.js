const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    name: { type: String, require: true },
    numberId: { type: Number, require: true },
    organization: { type: String, require: true },
    admin: { type: Boolean, default: false },
  },
  { timestampe: true }
);

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
