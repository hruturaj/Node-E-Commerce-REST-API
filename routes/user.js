const router = require("express").Router();
const {
  verifyToken,
  verifyTokenandAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const SHA256 = require("crypto-js/SHA256");
const User = require("../models/User");

// verify user with token
router.put("/:id", verifyTokenandAuthentication, (req, res) => {
  if (req.body.password) {
    req.body.password = SHA256(
      req.body.password + process.env.SECRETKEY
    ).toString();
  }

  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((updateUser) => res.status(200).json(updateUser))
    .catch((err) => res.status(500).json(err));
});

// delete user
router.delete("/:id", verifyTokenandAuthentication, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("user has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

// get user
router.get("/find/:id", verifyTokenAndAdmin, (req, res) => {
  User.findById(req.params.id)
    .then((userData) => {
      const { password, ...data } = userData._doc;
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json(err));
});

// get all user
router.get("/", verifyTokenAndAdmin, (req, res) => {
  const query = req.query.new;
  const users = query ? User.find().sort({ _id: -1 }).limit(5) : User.find();
  users
    .then((userData) => {
      res.status(200).json(userData);
    })
    .catch((err) => res.status(500).json(err));
});

// get user status => send users data per date
router.get("/stats", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]).then((data) => res.status(200).json(data));
});

module.exports = router;
