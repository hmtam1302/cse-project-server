const mongoose = require("mongoose");

//SETTINGS SCHEMA
const SystemSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    default: 40,
  },
  noise: {
    type: Number,
    default: 800,
  },
  gas: {
    type: Number,
    default: 1,
  },
});

module.exports = new mongoose.model("System", SystemSchema);
