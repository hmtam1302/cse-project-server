const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Setting = require("../models/Settings");
const Notification = require("../models/Notifications");
const Feedback = require("../models/Feedbacks");

//Encrypt password
const bcrypt = require("bcrypt");
//USER SECTION
//POST: CREATE A NEW USER
router.post("/signup", async (req, res) => {
  //QUERY USERNAME
  let response = await User.find({ username: req.body.username });
  if (response.length > 0) {
    res.json({ message: "Username has been registered!" });
  } else {
    response = await User.find({ email: req.body.email });
    if (response.length > 0) {
      res.json({ message: "Email has been used!" });
    } else {
      let user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        settings: new Setting(),
        role: "user",
      });

      user
        .save()
        .then((response) => res.json({ message: "Signup success!" }))
        .catch((err) =>
          res
            .status(500)
            .json({ message: `User was not stored in database\n${err}` })
        );
    }
  }
});

//GET: GET USER DATA
router.get("/:username", async (req, res) => {
  let response = await User.find(
    { username: req.params.username },
    "full_name email phone birthday floor role avt settings notifications"
  );
  if (response.length === 0) {
    res.json({ message: "No user found!" });
  } else {
    res.json(response[0]);
  }
});

//POST: PASSWORD FOR LOGIN
router.post("/login/", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  //GET PASSWORD
  const response = await User.find({ username: username });
  if (response.length === 0) {
    res.json({ message: "User not found!" });
  } else {
    if (bcrypt.compareSync(password, response[0].password)) {
      res.json({ message: "Login success!" });
    } else {
      res.json({ message: "Wrong password!" });
    }
  }
});

//PUT: UPDATE USER DATA
router.put("/:username/:type", async (req, res) => {
  let data = {
    [req.params.type]: req.body.value,
  };

  await User.findOneAndUpdate({ username: req.params.username }, data)
    .then(() => res.json({ message: "Update success!" }))
    .catch((err) => res.json({ message: `Update failed: ${err}` }));
});

//PUT: UPDATE PASSWORD
router.put("/changepassword", async (req, res) => {
  const username = req.body.username;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  //Check password
  let response = await User.find({ username: username });
  //Find user
  if (response.length === 0) {
    res.json({ message: "User not found!" });
  } else {
    //Check password
    if (bcrypt.compareSync(oldPassword, response[0].password)) {
      //Accept change password
      const hashPassword = bcrypt.hashSync(newPassword, 10);
      await User.findOneAndUpdate(
        { username: username },
        { password: hashPassword }
      );
      res.json({ message: "Change password success!" });
    } else {
      res.json({ message: "Wrong old password! Try again" });
    }
  }
});

//POST: SEND FEEDBACKS
router.post("/:username/feedbacks", async (req, res) => {
  let feedback = new Feedback({
    username: req.params.username,
    experience: req.body.experience,
    error: req.body.error,
    rating: req.body.rating,
  });

  feedback
    .save()
    .then((response) => res.json({ message: "Send feedbacks success!" }))
    .catch((err) =>
      res
        .status(500)
        .json({ message: `Feedback  was not store in database\n${err}` })
    );
});

//POST: SEND NOTIFICATION
router.post("/:username/notifications", async (req, res) => {
  let notification = new Notification({
    username: req.params.username,
    status: req.body.status,
    element: req.body.element,
    time: req.body.time,
  });

  notification
    .save()
    .then((response) => res.json({ message: "Send notification success!" }))
    .catch((err) =>
      res
        .status(500)
        .json({ message: `Notification  was not store in database\n${err}` })
    );
});

//GET: NOTIFICATION
router.get("/:username/notifications", async (req, res) => {
  let response = await Notification.find(
    { username: req.params.username },
    "_id status element time isRead"
  );
  if (response.length > 0) {
    res.json({ notifications: response });
  } else {
    res.json({ message: "No notifications found!" });
  }
});

//PUT: UPDATE NOTIFICATION
router.put("/:username/notifications/:id", async (req, res) => {
  Notification.findByIdAndUpdate(req.params.id, { isRead: true })
    .then(() => res.json({ message: "Update notification success!" }))
    .catch((err) =>
      res.json({ message: `Update notification failed: ${err}` })
    );
});

//DELETE: NOTIFICATION
router.delete("/:username/notifications/:id", async (req, res) => {
  Notification.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: "Remove notification success!" }))
    .catch((err) =>
      res.json({ message: `Cannot delete notification!\n${err}` })
    );
});

//POST: SEND EMAIL NOTIFICATION
router.post("/sendmail", async (req, res) => {
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
    subject: "Notification",
    text: `Notification:\n${req.body.message}\nThis is an automatic email from system, you can disable in your settings!`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ message: `Send mail notification failed\n${error}` });
    } else {
      res.json({ message: "Send success!" });
    }
  });
});

module.exports = router;
