require("dotenv").config();
const Admin = require("../models/adminModel");
const Order = require("../models/orderModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
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

// GET EXPENSE FOR A MONTH
const getMonthlyExpense = async (req, res) => {
  const { month, year } = req.params;
  // console.log(month, year);
  try {
    // Get the first and last dates of the month
    const date1 = new Date(year, month - 1, 1);
    const date2 = new Date(year, month, 0);

    let monthlyExpense = 0;

    const result = await Order.collection
      .aggregate([
        {
          $match: {
            //get orders between date1 and date2
            orderDate: {
              $gte: date1,
              $lte: date2,
            },
          },
        },
        {
          $unwind: "$products", // Deconstruct the array of products
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // Deconstruct the array of productDetails
        },
        {
          $group: {
            _id: "$_id",
            totalExpense: {
              $sum: {
                $multiply: ["$productDetails.expense", "$products.quantity"],
              },
            },
          },
        },
      ])
      .toArray();

    // console.log(result);

    result.forEach((result) => (monthlyExpense += result.totalExpense));

    // console.log(monthlyExpense);
    res.status(200).json(monthlyExpense);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting expense data." });
  }
};

// GET MONTHLY REVENUE
const getMonthlyRevenue = async (req, res) => {
  const { month, year } = req.params;

  try {
    // Get the first and last dates of the month
    const date1 = new Date(year, month - 1, 1);
    const date2 = new Date(year, month, 0);
    let monthlyRevenue = 0;

    const result = await Order.collection
      .aggregate([
        {
          $match: {
            //get orders between date1 and date2
            orderDate: {
              $gte: date1,
              $lte: date2,
            },
          },
        },
        {
          $unwind: "$products", // Deconstruct the array of products
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$productDetails", // Deconstruct the array of productDetails
        },
        {
          $group: {
            _id: "$_id",
            totalRevenue: {
              $sum: {
                $multiply: ["$productDetails.price", "$products.quantity"], // Replace "expense" with "price"
              },
            },
          },
        },
      ])
      .toArray();

    // console.log(result);

    result.forEach((result) => (monthlyRevenue += result.totalRevenue));

    // console.log(monthlyRevenue);
    res.status(200).json(monthlyRevenue);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting expense data." });
  }
};

// GET PAST 12 MONTHS EXPENSE
const getYearlyExpense = async (req, res) => {
  let { month, year } = req.params;
  let expenseArr = [];
  try {
    // Get the first and last dates of the month
    for (let i = 0; i < 12; i++) {
      const date1 = new Date(year, month - 1, 1); // Month is zero-based
      const date2 = new Date(year, month, 0);
      let monthlyExpense = 0;

      const result = await Order.collection
        .aggregate([
          {
            $match: {
              //get orders between date1 and date2
              orderDate: {
                $gte: date1,
                $lte: date2,
              },
            },
          },
          {
            $unwind: "$products", // Deconstruct the array of products
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails", // Deconstruct the array of productDetails
          },
          {
            $group: {
              _id: "$_id",
              totalExpense: {
                $sum: {
                  $multiply: ["$productDetails.expense", "$products.quantity"],
                },
              },
            },
          },
        ])
        .toArray();
      result.forEach((result) => (monthlyExpense += result.totalExpense));
      expenseArr.push(monthlyExpense);
      if (month == 1) {
        year--;
        month = 12;
      }
      month--;
    }

    // console.log(result);

    console.log(expenseArr);
    res.status(200).json(expenseArr);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting expense data." });
  }
};

// GET PAST 12 MONTHS REVENUE
const getYearlyRevenue = async (req, res) => {
  let { month, year } = req.params;
  let revenueArr = [];
  try {
    // Get the first and last dates of the month
    for (let i = 0; i < 12; i++) {
      const date1 = new Date(year, month - 1, 1); // Month is zero-based
      const date2 = new Date(year, month, 0);
      console.log(date1, date2);
      let monthlyRevenue = 0;

      const result = await Order.collection
        .aggregate([
          {
            $match: {
              //get orders between date1 and date2
              orderDate: {
                $gte: date1,
                $lte: date2,
              },
            },
          },
          {
            $unwind: "$products", // Deconstruct the array of products
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails", // Deconstruct the array of productDetails
          },
          {
            $group: {
              _id: "$_id",
              totalRevenue: {
                $sum: {
                  $multiply: ["$productDetails.price", "$products.quantity"],
                },
              },
            },
          },
        ])
        .toArray();
      result.forEach((result) => (monthlyRevenue += result.totalRevenue));
      revenueArr.push(monthlyRevenue);
      if (month == 1) {
        year--;
        month = 12;
      }
      month--;
    }

    // console.log(result);

    console.log(revenueArr);
    res.status(200).json(revenueArr);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting expense data." });
  }
};

// GET YEARLY REVENUE BY CATEGORY
const getYearlyRevenueByCategory = async (req, res) => {
  let categories = ["Men", "Women", "Kids"];
  let { month, year } = req.params;
  let revenueByCategory = [];
  
  const date2 = new Date(year, month - 1, 1);
  const date1 = new Date(date2);
  date1.setMonth(date1.getMonth() - 12);
  try {
    for (const category of categories) {
      const result = await Order.collection
        .aggregate([
          {
            $match: {
              //get orders between date1 and date2
              orderDate: {
                $gte: date1,
                $lte: date2,
              },
            },
          },
          {
            $unwind: "$products",
          },
          {
            $lookup: {
              from: "products",
              localField: "products.product",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $match: {
              "productDetails.category": category,
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $multiply: ["$productDetails.price", "$products.quantity"],
                },
              },
            },
          },
        ])
        .toArray();

      const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
      revenueByCategory.push(totalRevenue);
    }

    // console.log(revenueByCategory);
    res.status(200).json(revenueByCategory);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting revenue data by category." });
  }
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

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.collection
      .aggregate([
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
          $project: {
            _id: 1,
            customerName: "$customerDetails.name",
            total: 1,
            status: 1,
            orderDate: 1,
            paymentMethod: 1,
            deliveryAddress: 1,
            products: {
              $map: {
                input: "$products",
                as: "product",
                in: "$$product.product",
              },
            },
          },
        },
      ])
      .toArray();

    res.json(orders);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "Error getting orders with customer names." });
  }
};

// TOTAL ORDERS IN PAST 12 MONTHS
const getPastYearOrders = async (req, res) => {
  try {
    const result = await Order.collection
      .aggregate([
        {
          $unwind: "$products", // Deconstruct the array of products
        },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$products.quantity" },
          },
        },
      ])
      .toArray();
    // console.log("Sales ", result);
    if (result.length > 0) {
      res.json(result[0].totalQuantity);
    } else {
      res.json(0);
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error getting total quantity." });
  }
};

// GET TRENDING PRODUCTS (TOP 5 MOST ORDERED PRODUCTS)
const getTrendingProducts = async (req, res) => {
  try {
    // Step 1: Aggregate the Products and Quantities
    const result = await Order.collection
      .aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product",
            totalQuantity: { $sum: "$products.quantity" },
          },
        },
      ])
      .toArray();

    // Step 2: Sort by Quantity and Limit to Top 5
    const sortedResult = result
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Step 3: Get Product Details
    const detailedResult = await Product.collection
      .aggregate([
        {
          $match: {
            _id: { $in: sortedResult.map((item) => item._id) },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: "$productDetails._id",
            name: "$productDetails.productName",
            price: "$productDetails.price",
            images: "$productDetails.images",
            stock: "$productDetails.stock",
            totalQuantity: 1,
          },
        },
      ])
      .toArray();

    // console.log("TRENDING PRODUCTS", detailedResult);
    res.json(detailedResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
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
  getTrendingProducts,
};
