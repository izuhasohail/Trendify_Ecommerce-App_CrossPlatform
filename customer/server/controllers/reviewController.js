const Review = require("../models/reviewModel");
const mongoose = require("mongoose");

//Add a review
const addReview = async (req, res) => {
  console.log('inside add review')
  const { customer, product, rating, reviewMessage, orderId } = req.body;
  console.log(customer)
  try {
    const review = await Review.create({
      customer,
      product,
      rating,
      reviewMessage,
      orderId,
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });
  res.status(200).json(reviews);
};

//Get a single review
const getReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such review" });
  }

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ error: "No such review" });
  }
  res.status(200).json(review);
};

//Update a review
const updateReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such review" });
  }

  const review = await Review.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!review) {
    return res.status(400).json({ error: "No such review" });
  }

  res.status(200).json(review);
};

//Delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such review" });
  }

  const review = await Review.findOneAndDelete({ _id: id });

  if (!review) {
    return res.status(400).json({ error: "No such review" });
  }

  res.status(200).json(review);
};

//Get reviews of a customer
const custReviews = async (req, res) => {
  const { customer } = req.query;
  const reviews = await Review.find({
    customer: new mongoose.Types.ObjectId(customer),
  })
    .populate("product", "productName images")
    .populate({
      path: "orderId",
      select: "orderDate",
      populate: {
        path: "products.product",
        model: "Product",
        select: "productName images",
      },
    })
    .exec();

  if (!reviews) {
    return res.status(404).json({ error: "No such reviews" });
  }

  const formattedReviews = reviews.map((review) => {
    return {
      rating: review.rating,
      reviewMessage: review.reviewMessage,
      productName: review.product.productName,
      productImages: review.product.images,
      orderDate: review.orderId.orderDate,
    };
  });

  res.status(200).json(formattedReviews);
};

// Get reviews of a product
const productReviews = async (req, res) => {
  console.log("in product reviews controller");
  const { product } = req.query;
  if (!mongoose.Types.ObjectId.isValid(product)) {
    return res.status(404).json({ error: "Invalid product ID" });
  }
  const reviews = await Review.find({ product: product });
  if (!reviews) {
    return res.status(404).json({ error: "No such reviews" });
  }
  res.status(200).json(reviews);
};

//get reviews alongwith customer name
const prodReviewsWithCustomer = async (req, res) => {
  try {
    console.log("inside product review with customer");
    const { product } = req.query;
    console.log(product);
    if (!mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    console.log("valid product id");

    const result = await Review.aggregate([
      {
        $match: { product: new mongoose.Types.ObjectId(product) },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: "$customerDetails",
      },
      {
        $group: {
          _id: "$_id",
          customerName: { $first: "$customerDetails.name" },
          rating: { $first: "$rating" },
          message: { $first: "$reviewMessage" },
        },
      },
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for the given product ID" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = {
  addReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  custReviews,
  productReviews,
  prodReviewsWithCustomer,
};
