const mongoose = require("mongoose");
require("dotenv").config();
const DB = process.env.DB;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connected");
  } catch (error) {
    console.error(`Can't connect to DB: ${error.message}`);
  }
};

module.exports = connectDB;
