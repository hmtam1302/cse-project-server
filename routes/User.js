const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Setting = require("../models/Settings");

//Encrypt password
const bcrypt = require("bcrypt");

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

  User.findOneAndUpdate({ username: req.params.username }, data)
    .then(() => res.json({ message: "Update success!" }))
    .catch((err) => res.json({ message: `Update failed: ${err}` }));
});

module.exports = router;
