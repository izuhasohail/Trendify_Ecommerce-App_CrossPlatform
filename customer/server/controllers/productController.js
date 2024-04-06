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

//Get a single Product
const getProduct = async (req, res) => {
  console.log("get product call");
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such product" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }
  res.status(200).json(product);
};

//Update a Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
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

//Get specific Products
const filterProducts = async (req, res) => {
  try {
    let query = {}
    // Check if category is 'unstitched' or 'stitched'
    if (req.query.category && (req.query.category.toLowerCase() === 'unstitched' || req.query.category.toLowerCase() === 'stitched')) {
      const isStitchedValue = req.query.category.toLowerCase() === 'stitched';
      query.isStitched = isStitchedValue;
    }

    else if (req.query.category && req.query.category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    

    // Check if there is a query parameter for maximum price
    if (req.query.maxPrice) {
      query.price = { $lte: parseFloat(req.query.maxPrice) }
    }

    // Check if there is a query parameter for limiting the number of results
    const limit = req.query.limit ? parseInt(req.query.limit) : 0

    // Use the Mongoose find method with the built query
    const products = await Product.find(query).limit(limit)
    if(!products){
      return res.status(400).json({error: 'No such products'})
    }
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

//Get related products
const getRelatedProducts = async (req, res) => {
  try {
    const {id} = req.params;

    // Find the product by its ID to determine its category
    const selectedProduct = await Product.findById(id);

    if (!selectedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const query = {
      // Exclude the product with the specified ID
      _id: { $ne: id },

      // Include products with the same category as the selected product
      category: { $regex: new RegExp(`^${selectedProduct.category}$`, "i") },
      
      // Optionally, you can add more conditions like maximum price or other criteria
    };

    // Check if there is a query parameter for limiting the number of results
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;

    // Use the Mongoose find method with the built query
    const relatedProducts = await Product.find(query).limit(limit);

    if (!relatedProducts.length) {
      return res.status(404).json({ error: "No related products found" });
    }

    res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  filterProducts,
  getRelatedProducts
};
