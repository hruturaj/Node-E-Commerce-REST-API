const router = require("express").Router();
const {
  verifyToken,
  verifyTokenandAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const SHA256 = require("crypto-js/SHA256");
const Cart = require("../models/Cart");

// create product
router.post("/", verifyToken, (req, res) => {
  const newCart = new cart(req.body);
  const savedCart = newCart.save();
  savedCart
    .then((cart) => res.status(200).json(cart))
    .catch((err) => res.status(401).json(err));
});

// update cart
router.put("/:id", verifyTokenandAuthentication, (req, res) => {
  Cart.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((updateCart) => res.status(200).json(updateCart))
    .catch((err) => res.status(500).json(err));
});

// delete cart
router.delete("/:id", verifyTokenandAuthentication, (req, res) => {
  Cart.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Cart has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

// get user cart
router.get("/find/:userId", verifyTokenandAuthentication, (req, res) => {
  Cart.findById({ userId: req.params.userId })
    .then((cart) => {
      res.status(200).json(cart);
    })
    .catch((err) => res.status(500).json(err));
});

// get all Cart
router.get("/", verifyTokenAndAdmin, (req, res) => {
  Cart.find()
    .then((carts) => res.status(200).json(carts))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
