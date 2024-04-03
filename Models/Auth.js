const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    numberID: { type: Number, require: true },
    organization: { type: String, require: true },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
