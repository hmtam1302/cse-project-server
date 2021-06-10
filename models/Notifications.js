const mongoose = require("mongoose");

//NOTIFICATION SCHEMA
const NotificationSchema = new mongoose.Schema({
  username: String,
  status: String,
  element: String,
  time: String,
});

module.exports = new mongoose.model("Notification", NotificationSchema);
