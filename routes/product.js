const router = require("express").Router();
const {
  verifyToken,
  verifyTokenandAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const SHA256 = require("crypto-js/SHA256");
const Product = require("../models/Product");

// create product
router.post("/", verifyTokenAndAdmin, (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = newProduct.save();
  savedProduct
    .then((product) => res.status(200).json(product))
    .catch((err) => res.status(401).json(err));
});

// update product
router.put("/:id", verifyTokenAndAdmin, (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((updateProduct) => res.status(200).json(updateProduct))
    .catch((err) => res.status(500).json(err));
});

// delete product
router.delete("/:id", verifyTokenAndAdmin, (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Product has been deleted..."))
    .catch((err) => res.status(500).json(err));
});

// get product
router.get("/find/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => res.status(500).json(err));
});

// get all products
router.get("/", (req, res) => {
  const query_new = req.query.new;
  const query_category = req.query.category;
  let products;
  if (query_new) {
    products = Product.find().sort({ _id: -1 }).limit(5);
  } else if (query_category) {
    products = Product.find({
      categories: {
        $in: [query_category],
      },
    });
  } else {
    products = Product.find();
  }

  products
    .then((product) => {
      res.status(200).json(product);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
