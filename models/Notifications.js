const mongoose = require("mongoose");

//NOTIFICATION SCHEMA
const NotificationSchema = new mongoose.Schema({
  username: String,
  status: String,
  element: String,
  time: String,
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = new mongoose.model("Notification", NotificationSchema);
