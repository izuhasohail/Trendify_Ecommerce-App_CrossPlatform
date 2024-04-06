require("dotenv").config();
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const Review = require("../models/reviewModel")
const mongoose = require("mongoose");
const Product=require('../models/productModel')
const nodemailer = require("nodemailer");
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)

//Add an order
const addOrder = async (req, res) => {
  const {
    customer,
    products,
    deliveryAddress,
    billingAddress,
    total,
    paymentMethod,
  } = req.body;
  try {

    // Update product stock
    for (const product of products) {
      const { product: productId, quantity } = product;
      // Find the product by ID
      const existingProduct = await Product.findById(productId);

      // Update the stock
      if (existingProduct) {
        existingProduct.stock -= quantity;
        await existingProduct.save();
      }
    }
    

    const order = await Order.create({
      customer,
      products,
      deliveryAddress,
      billingAddress,
      total,
      paymentMethod,
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Get all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ orderDate: -1 });
  res.status(200).json(orders);
};

//Get a single order
const getOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such order" });
  }

  const order = await Order.findById(id);

  if (!order) {
    return res.status(404).json({ error: "No such order" });
  }
  res.status(200).json(order);
};

//Update an order's status
const updateOrder = async (req, res) => {
  console.log("INSIDE STATUS API");
  const { id, status } = req.body;
  console.log(status, id);
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    console.log(updatedOrder);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    } else {
      const customer = await Customer.findById(updatedOrder.customer);
      // console.log(customer);
      const email = customer.email;
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: `Order Status`,
        text: `Dear Customer Your Order#${id} Has Been: ${status}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send(`error`);
        } else {
          res.send("Email sent: " + info.response);
        }
      });
    }
    res
      .status(200)
      .json({ message: "Status updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such order" });
  }

  const order = await Order.findOneAndDelete({ _id: id });

  if (!order) {
    return res.status(400).json({ error: "No such order" });
  }

  res.status(200).json(order);
};

//Get orders of a customer to review
const custOrdersToReview = async (req, res) => {
  const { customer } = req.params;
  if (!mongoose.Types.ObjectId.isValid(customer)) {
    return res.status(404).json({ error: "Invalid customer ID" });
  }
  const orders = await Order.find({
    customer: customer,
    status: new RegExp("delivered", "i"),
  });
  if (!orders) {
    return res.status(404).json({ error: "No such orders" });
  }
  res.status(200).json(orders);
};

//Get orders of a customer
const custOrders = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid customer ID" });
  }
  const orders = await Order.aggregate([
    {
      $match: {
        customer: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productsData",
      },
    },
    {
      $project: {
        customer: 1,
        orderDate: 1,
        deliveryAddress: 1,
        total: 1,
        paymentMethod: 1,
        status: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productsData",
                      as: "pd",
                      cond: {
                        $eq: ["$$pd._id", "$$product.product"],
                      },
                    },
                  },
                  0,
                ],
              },
              quantity: "$$product.quantity",
            },
          },
        },
      },
    },
  ]);
  if (!orders) {
    return res.status(404).json({ error: "No such orders" });
  }
  res.status(200).json(orders);
};



//Get products that user has not yet reviewed
const getProdWithoutReviews = async (req, res) => {
  try {
    const customerId = new mongoose.Types.ObjectId(req.params._id);
    console.log("inside getProdWithoutReviews", customerId);

    const singleProduct = await Order.aggregate([
      {
        $match: {
          customer: customerId,
          status: "Delivered",
        },
      },
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "prodData",
        },
      },
      {
        $unwind: {
          path: "$prodData",
        },
      },
    ]);

    console.log("Delivered products", singleProduct);

    const customerReviews = await Review.find({ customer: customerId });

    console.log("Reviewed products: ", customerReviews);

    // filter unreviewed products
    for (let i = 0; i < singleProduct.length; i++) {
      const orderItem = singleProduct[i];
      for (let j = 0; j < customerReviews.length; j++) {
        const reviewItem = customerReviews[j];
        if (
          orderItem._id.toString() === reviewItem.orderId.toString() &&
          orderItem.products.product.toString() ===
            reviewItem.product.toString()
        ) {
          singleProduct.splice(i, 1);
          i--;
          break;
        }
      }
    }
    console.log("Unreviewed products: ", singleProduct);

    const formattedProducts = singleProduct.map((product) => {
      return {
        productId: product.products.product,
        productName: product.prodData.productName,
        productImages: product.prodData.images,
        customerId: product.customer,
        orderId: product._id,
        orderDate: product.orderDate,
      };
    });

    console.log("Formatted products for reviews", formattedProducts);

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching unreviewed products",
      error: error.toString(),
    });
  }
};

//Create payment
const createPaymentIntent = async (req, res) => {
  console.log('inside create payment controller')
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  res.json({
    id: session.id,
  });
};

module.exports = {
  addOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  custOrders,
  custOrdersToReview,
  getProdWithoutReviews,
  createPaymentIntent,
};
