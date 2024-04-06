const express = require('express')
const {
    authAdmin,
    contactUs,
    getAllCustomers
} = require('../controllers/adminController')

const adminRouter = express.Router()

// Specific routes first
adminRouter.get('/getAllCustomers', getAllCustomers);

// Admin authentication
adminRouter.post('/login', authAdmin);

// Contact us form submission
adminRouter.post('/contactus', contactUs);

module.exports = adminRouter
