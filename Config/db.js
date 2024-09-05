const mongoose = require('mongoose');require('dotenv').config();
const DB = process.env.DB;

const connectDB = async () => {
  console.log('connecting DB');
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connected');
  } catch (error) {
    console.error(`Can't connect to DB: ${error.message}`);
  }
};

module.exports = connectDB;
