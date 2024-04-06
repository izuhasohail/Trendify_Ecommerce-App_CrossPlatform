const express = require('express')
const {
    authAdmin,
    contactUs,
    getMonthlyExpense,
    getMonthlyRevenue,
    getYearlyExpense,
    getYearlyRevenue,
    getYearlyRevenueByCategory,
    getAllCustomers,
    getAllOrders,
    getPastYearOrders,
    getTrendingProducts
    // addAdmin
} = require('../controllers/adminController')

const adminRouter = express.Router()

// Specific routes first
adminRouter.get('/getAllCustomers', getAllCustomers);
adminRouter.get('/getAllOrders', getAllOrders);

// Dynamic routes
adminRouter.get('/getMonthlyExpense/:month/:year', getMonthlyExpense);
adminRouter.get('/getMonthlyRevenue/:month/:year', getMonthlyRevenue);
adminRouter.get('/getYearlyExpense/:month/:year', getYearlyExpense);  // Assuming this is intentional
adminRouter.get('/getYearlyRevenue/:month/:year', getYearlyRevenue);  // Assuming this is intentional
adminRouter.get('/getTotalRevenueByCategory/:month/:year', getYearlyRevenueByCategory);

// General routes
adminRouter.get('/totalSales12Months', getPastYearOrders);
adminRouter.get('/trendingProducts', getTrendingProducts);

// Admin authentication
adminRouter.post('/login', authAdmin);

// Contact us form submission
adminRouter.post('/contactus', contactUs);

//Add Admin
// adminRouter.post('/',addAdmin
// )

module.exports = adminRouter
