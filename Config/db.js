const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://6431503083:ugjpxNMd5MiH7OOy@cluster0.kg5bvnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("DB connected");
  } catch (error) {
    console.error(`Can't connect to DB: ${error.message}`);
  }
};

module.exports = connectDB;
