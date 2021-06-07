const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

//Connect to mongoose
mongoose
  .connect(process.env.MONGO_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  .then(() => {
    console.log("Connected to mongodb atlas");
  })
  .catch(err => {
    console.log("Something wrong happened!", err);
  })
app.listen(PORT, () => {
  console.log("Server started at PORT ", PORT);
});
