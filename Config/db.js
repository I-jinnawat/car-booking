const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TestDB");
    console.log("DB connected");
  } catch (error) {
    console.error(`Can't connect to DB: ${error.message}`);
  }
};

module.exports = connectDB;
