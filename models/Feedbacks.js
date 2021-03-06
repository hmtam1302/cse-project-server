const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  username: String,
  experience: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
  rating: Number,
});

module.exports = new mongoose.model("Feedback", FeedbackSchema);
