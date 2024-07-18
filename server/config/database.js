const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Database Successfully."))
    .catch((err) => {
      console.error(err);
      console.log("Couldn't Connect to Database.");
      process.exit(1);
    });
};
