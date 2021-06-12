const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const System = require("../models/Systems");
//Encrypt password
const bcrypt = require("bcrypt");

//POST: Send email to password
router.post("/forgotpassword", async (req, res) => {
  //Find email if found
  let response = await User.find({ email: req.body.email });
  if (response.length === 0) {
    res.json({ message: "Email has not been registered!" });
  } else {
    var generator = require("generate-password");
    var password = generator.generate({
      length: 10,
      numbers: true,
    });
    const hashPassword = bcrypt.hashSync(password, 10);

    //Update password
    await User.findOneAndUpdate(
      { email: req.body.email },
      {
        password: hashPassword,
      }
    );
    //Send password to email
    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hhharyo28@gmail.com",
        pass: "Minhtam123",
      },
    });

    var mailOptions = {
      from: "hhharyo28@gmail.com",
      to: req.body.email,
      subject: "Reset password",
      text: password,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.json({ message: `Send password failed\n${error}` });
      } else {
        res.json({ message: "Send password success!" });
      }
    });
  }
});

//PUT: UPDATE SYSTEM LIMITS
router.put("/changelimit", async (req, res) => {
  //Check user role
  let response = await User.find({ username: req.body.username }, "role");
  if (response.length === 0) {
    res.json({ message: "User not found!" });
  } else if (response[0].role !== "admin") {
    res.json({ message: "You have no permission!" });
  } else {
    const data = {
      temperature: req.body.temperature,
      noise: req.body.noise,
      gas: req.body.gas,
    };
    System.findByIdAndUpdate("60c4f50cd5cd0eb1196a8ec9", data)
      .then((response) => res.json({ message: "Update system success!" }))
      .catch((err) => res.json({ message: "Update system failed\n" + err }));
  }
});

//GET: GET SYSTEM LIMITS
router.get("/", async (req, res) => {
  let response = await System.findById("60c4f50cd5cd0eb1196a8ec9");
  res.json({ system: response });
});

module.exports = router;
