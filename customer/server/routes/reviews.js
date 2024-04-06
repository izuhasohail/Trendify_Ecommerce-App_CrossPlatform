const express = require('express')
const {
    addReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
    custReviews,
    productReviews,
    prodReviewsWithCustomer
} = require('../controllers/reviewController')

const reviewRouter = express.Router()


// GET reviews with customer names
reviewRouter.get('/prodReviewsWithCustomer', prodReviewsWithCustomer)

// GET a customer review
reviewRouter.get('/custReviews', custReviews)

// GET a product review
reviewRouter.get('/productReviews', productReviews)


// GET a single review
reviewRouter.get('/:id', getReview)

// UPDATE a review
reviewRouter.patch('/:id', updateReview)

// DELETE a review
reviewRouter.delete('/:id', deleteReview)

// POST a review
reviewRouter.post('/', addReview)

// GET all reviews (should be defined after specific routes)
reviewRouter.get('/', getAllReviews)


module.exports = reviewRouter
