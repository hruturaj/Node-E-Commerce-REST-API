const router = require("express").Router();
const User = require("../models/User");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

const SHA256 = crypto.SHA256;

// register new user
router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: SHA256(req.body.password + process.env.SECRETKEY),
  });

  newUser
    .save()
    .then((savedUser) => res.status(201).json(savedUser))
    .catch((err) => res.status(500).json("error:" + err));
});

//login
router.post("/login", (req, res) => {
  const user = User.findOne({
    username: req.body.username,
  });

  const hashPassword = SHA256(
    req.body.password + process.env.SECRETKEY
  ).toString();

  user
    .then((userData) => {
      // validating password
      if (hashPassword === userData.password) {
        return userData;
      }
    })
    .then((userData) => {
      const accessToken = jwt.sign(
        {
          id: userData.id,
          isAdmin: userData.isAdmin,
        },
        process.env.JWT_SECRETKEY,
        { expiresIn: "3d" }
      );
      const { password, ...data } = userData._doc;
      res.status(201).json({ data, accessToken });
    })
    .catch((err) => res.status(401).json("Wrong credentials"));
});

module.exports = router;
