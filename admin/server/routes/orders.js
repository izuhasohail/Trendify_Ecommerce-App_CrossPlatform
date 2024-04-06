const express = require("express");
const {
  getAllOrders,
  updateOrder
} = require("../controllers/orderController");

const orderRouter = express.Router();

// UPDATE an order
orderRouter.patch("/:id", updateOrder);

// GET all orders (should be defined after specific routes)
orderRouter.get("/", getAllOrders);


module.exports = orderRouter;
