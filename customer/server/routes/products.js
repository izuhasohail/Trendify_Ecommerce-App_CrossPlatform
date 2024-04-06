const express = require('express')
const {
    addProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    getRelatedProducts
} = require('../controllers/productController')

const productRouter = express.Router()

// GET specific products
productRouter.get('/filter', filterProducts);

// GET a single product
productRouter.get('/:id', getProduct);

//add a product 
productRouter.post('/upload', addProduct)

// UPDATE a product
productRouter.patch('/:id', updateProduct);

// DELETE a product
productRouter.delete('/:id', deleteProduct);

// GET all products (should be defined after specific routes)
productRouter.get('/', getAllProducts);

// Get related products
productRouter.get('/getRelatedProducts/:id', getRelatedProducts)


module.exports = productRouter
