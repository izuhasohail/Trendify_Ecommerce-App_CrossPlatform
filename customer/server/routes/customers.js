const express = require('express')
const {
    addCustomer,
    getAllCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    authCustomer,
    sendCaptcha
} = require('../controllers/customerController')

const customerRouter = express.Router()

//Customer Login
customerRouter.post('/login', authCustomer)

// customer captcha 
customerRouter.post('/captcha', sendCaptcha)

// GET a single Customer
customerRouter.get('/:id', getCustomer);

// POST a Customer
customerRouter.post('/createCustomer', addCustomer);

// UPDATE a Customer
customerRouter.patch('/', updateCustomer);

// DELETE a Customer
customerRouter.delete('/:id', deleteCustomer);

// GET all Customers (should be defined after specific routes)
customerRouter.get('/', getAllCustomers);


module.exports = customerRouter
