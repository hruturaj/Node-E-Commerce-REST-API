const router = require("express").Router();
const {
  verifyToken,
  verifyTokenandAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const crypto = require("crypto-js");
const Order = require("../models/Order");

const SHA256 = crypto.SHA256;

// create order
router.post("/", verifyToken, (req, res) => {
  const newOrder = new Order(req.body);
  const savedOrder = newOrder.save();
  savedOrder
    .then((order) => res.status(200).json(order))
    .catch((err) => res.status(401).json(err));
});

// update order
router.put("/:id", verifyTokenAndAdmin, (req, res) => {
  Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((updateOrder) => res.status(200).json(updateOrder))
    .catch((err) => res.status(500).json(err));
});

// delete order
router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Order has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

// get user orders
router.get("/find/:userId", verifyTokenandAuthentication, (req, res) => {
  Order.find({ userId: req.params.userId })
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => res.status(500).json(err));
});

// get all orders
router.get("/", verifyTokenAndAdmin, (req, res) => {
  Order.find()
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(500).json(err));
});

// get monthly income
router.get("/income", verifyTokenAndAdmin, (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setDate(lastMonth.getMonth() - 1));
  Order.aggregate([
    {
      $match: { createdAt: { $gte: prevMonth } },
    },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ])
    .then((income) => res.status(200).json(income))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
