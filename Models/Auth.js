const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // role: { type: String, default: "user" }, // Default role is user
    admin: { type: Boolean, default: false },
  },
  { timestampe: true }
);

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = Auth;
