const mongoose = require("mongoose");
const Setting = require("./Settings");
const Notification = require("./Notifications");
const Feedback = require("./Feedbacks");

//USER SCHEMA
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  full_name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
  },
  birthday: {
    type: String,
    default: null,
  },
  floor: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  settings: Setting.schema,
  notifications: {
    type: [Notification.schema],
    default: [],
  },
});

module.exports = new mongoose.model("User", UserSchema);
