const express = require("express");
const router = express.Router();
const User = require("../models/Users");
//Encrypt password
const bcrypt = require("bcrypt");

//Send email to password
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

module.exports = router;
