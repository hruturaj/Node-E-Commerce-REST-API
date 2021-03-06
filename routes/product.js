const router = require("express").Router();
const {
  verifyToken,
  verifyTokenandAuthentication,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const crypto = require("crypto-js");
const Product = require("../models/Product");

const SHA256 = crypto.SHA256;

// create product
/**
 * @swagger
 * /api/products:
 *   post:
 *     description: To add new products, only access by admin. Verified by JWT token.
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *          type: object
 *     responses:
 *      '200':
 *        description: Product added successfully.
 *      '401':
 *        description: Need to hold admin rights to add new product.
 *     securityDefinitions:
        Bearer:
          type: apiKey
          name: Authorization
          in: header
 */
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
