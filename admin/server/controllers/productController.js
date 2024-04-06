const Product = require("../models/productModel");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

//Add a Product
const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.images = newProduct.images[0].split(",");
    console.log(newProduct);
    newProduct.isStitched = req.body.isStitched;
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all Products
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.status(200).json(products);
};

//Update a Product
const updateProduct = async (req, res) => {
  const { id, stock } = req.body;
  console.log("INSIDE UPATE PRODUCT");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such product" });
  }

  const product = await Product.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      ...req.body,
    }
  );
  console.log(product);
  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

//Delete a Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such product" });
  }

  const product = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
