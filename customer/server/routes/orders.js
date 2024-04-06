const express = require("express");
const {
  addOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  custOrders,
  createPaymentIntent,
  getProdWithoutReviews,
  custOrdersToReview
} = require("../controllers/orderController");

const orderRouter = express.Router();

// POST an order
orderRouter.post("/placeorder", addOrder);

//GET products that customer has not yet reviewed
orderRouter.get("/productsWithoutReviews/:_id", getProdWithoutReviews)

//GET unreviewed orders of a customer
orderRouter.get('/toreview/:id',custOrdersToReview)

//GET all orders of a customer
orderRouter.get('/customer/:id',custOrders)

// GET a single order
orderRouter.get("/:id", getOrder);

// UPDATE an order
orderRouter.patch("/:id", updateOrder);

// DELETE an order
orderRouter.delete("/:id", deleteOrder);

// GET all orders (should be defined after specific routes)
orderRouter.get("/", getAllOrders);

orderRouter.post("/create-payment", createPaymentIntent);

module.exports = orderRouter;
