const express = require('express')
const multer = require("multer")
const path = require("path")
const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const productRouter = express.Router()

// POST a product
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join( "../client/public"));
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, `${file.originalname}`);
    },
  });
  
const upload = multer({ storage });

productRouter.post('/upload', upload.array("files", 4), addProduct)

// UPDATE a product
productRouter.patch('/', updateProduct);

// DELETE a product
productRouter.delete('/:id', deleteProduct);

// GET all products (should be defined after specific routes)
productRouter.get('/', getAllProducts);

module.exports = productRouter