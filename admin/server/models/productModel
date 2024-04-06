const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    expense: {
      type: Number,
      required: true,
      min: 0,
    },
    isStitched: {
      type: Boolean,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    piece: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
    fabric: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model using the schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;