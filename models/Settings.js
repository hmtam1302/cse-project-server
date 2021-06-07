const mongoose = require("mongoose");

//SETTINGS SCHEMA
const SettingSchema = new mongoose.Schema({
  notification: {
    type: Boolean,
    default: true,
  },
  SMS: {
    type: Boolean,
    default: true,
  },
  phone_call: {
    type: Boolean,
    default: true,
  },
});

module.exports = new mongoose.model("Setting", SettingSchema);
