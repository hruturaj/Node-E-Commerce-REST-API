const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
let port = process.env.PORT || 3000;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      description: "E-commerce API Documentation",
      version: "1.0.0",
      contact: {
        name: "RE-NO-JS Developer",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.js"], // files containing annotations as above
};
const swaggerDocsGenerator = swaggerJsdoc(swaggerOptions);

// importing routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const cartRoutes = require("./routes/cart.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const stripeRoutes = require("./routes/stripe.js");

// configure middleware
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// applying routes to middleware express
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts ", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", stripeRoutes);

// generating routes for swagger api docs
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocsGenerator));

// connecting mongodb using mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection established"))
  .catch((err) => console.log(err));

// listening on port 3000 or specified port
app.listen(port, () => {
  console.log("Node express server listening on port");
});
