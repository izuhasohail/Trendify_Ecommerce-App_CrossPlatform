require("dotenv").config();
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const nodemailer = require("nodemailer");

//Get all orders
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ orderDate: -1 });
  res.status(200).json(orders);
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

module.exports = {
  getAllOrders,
  updateOrder
};
