require("dotenv").config();
const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Authenticate an Admin
const authAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Find the admin by email
    const admin = await Admin.findOne({ name });

    //if the admin doesn't exist
    if (!admin) {
      return res.status(401).json("No such admin");
    }

    // If the password doesn't match
    if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json("Wrong password");
    }

    // If the password matches
    return res.status(200).json("Admin authorized");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Contact us
const contactUs = async (req, res) => {
  const { name, email, number, message } = req.body;
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
    to: process.env.BUSINESS_EMAIL,
    subject: `Contact Us Message`,
    text: `Name: ${name}\nPhone Number: ${number}\nEmail: ${email}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send(`error`);
    } else {
      res.send("Email sent: " + info.response);
    }
  });
};

// GET ALL CUSTOMERS
const getAllCustomers = async (req, res) => {
  try {
    const projection = {
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      address: 1,
    };

    const customers = await Customer.collection
      .find({}, { projection })
      .toArray();

    // Aggregate to get number of orders and total spent for each customer
    const customerData = await Order.collection
      .aggregate([
        {
          $group: {
            _id: "$customer", // Group by customer ID
            numOrders: { $sum: 1 }, // Count the number of orders
            totalSpent: { $sum: "$total" }, // Sum the 'total' field for each order
          },
        },
      ])
      .toArray();

    // Merge customer data with the result of the customer collection
    const mergedCustomers = customers.map((customer) => {
      const matchingData = customerData.find(
        (data) => data._id.toString() === customer._id.toString()
      );

      // If there is matching data, add it to the customer object
      if (matchingData) {
        return {
          ...customer,
          numOrders: matchingData.numOrders,
          totalSpent: matchingData.totalSpent,
        };
      } else {
        // If there is no matching data, set default values
        return {
          ...customer,
          numOrders: 0,
          totalSpent: 0,
        };
      }
    });

    res.json(mergedCustomers);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting customers and order data." });
  }
};

module.exports = {
  authAdmin,
  contactUs,
  getAllCustomers
};
