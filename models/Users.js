const mongoose = require("mongoose");
const Setting = require("./Settings");
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
    type: Date,
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
  avt: {
    type: String,
    default: null,
  },
});

module.exports = new mongoose.model("User", UserSchema);
