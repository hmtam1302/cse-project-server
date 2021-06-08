const mongoose = require("mongoose");

//NOTIFICATION SCHEMA
const NotificationSchema = new mongoose.Schema({
  status: String,
  element: String,
  time: Date,
});

module.exports = new mongoose.model("Notification", NotificationSchema);
