const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://6431503083:12323@cluster0.qts5sdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ),
      {
        useNewUrlParser: true,
      };
    console.log("DB connected See you");
  } catch (error) {
    console.log("Can't connect Database ::::", error);
  }
};

module.exports = connectDB;
