const Customer = require("../models/customerModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Add a customer
const addCustomer = async (req, res) => {
  console.log("in add customer");
  const { name, email, phoneno, password } = req.body;
  console.log({ name, email, phoneno, password });
  try {
    const customer = await Customer.create({
      name: name,
      email: email,
      phone: phoneno,
      password: password,
      deliveryAddress: ";;Pakistan",
    });
    console.log(customer);
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: "Error creating customer" });
  }
};

//Authenticate a customer
const authCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    // Find the user by email
    const customer = await Customer.findOne({ email });

    console.log(customer);
    //if the customer doesn't exist
    if (!customer) {
      console.log("no customer");
      return res.status(401).json("No such customer");
    }

    // If the password doesn't match
    if (!(await bcrypt.compare(password, customer.password))) {
      console.log("wrong password");
      return res.status(401).json("Wrong password");
    }

    // If the password matches
    return res.status(200).json(customer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//Get all customers
const getAllCustomers = async (req, res) => {
  const customers = await Customer.find({}).sort({ createdAt: -1 });
  res.status(200).json(customers);
};

//Get a single customer
const getCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such customer" });
  }

  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(404).json({ error: "No such customer" });
  }
  res.status(200).json(customer);
};

//Update a customer
//Update a customer
const updateCustomer = async (req, res) => {
  const { id, currentPassword, ...updateParams } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such customer" });
  }

  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(400).json({ error: "No such customer" });
  }

  if (currentPassword) {
    // If the password doesn't match
    if (!(await bcrypt.compare(currentPassword, customer.password))) {
      return res.status(401).json("Incorrect Current Password!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(updateParams.password, salt);
      updateParams.password = hash;
      const response = await Customer.findOneAndUpdate(
        { _id: id },
        { $set: updateParams }
      );
      return res.status(200).json(response);
    }
  }

  const response = await Customer.findOneAndUpdate(
    { _id: id },
    { $set: updateParams }
  );
  res.status(200).json(response);
};

//Delete a customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such customer" });
  }

  const customer = await Customer.findOneAndDelete({ _id: id });

  if (!customer) {
    return res.status(400).json({ error: "No such customer" });
  }

  res.status(200).json(customer);
};

// SIGNUP CAPTCHA
const sendCaptcha = async (req, res) => {
  const { email, message } = req.body;
  //
  try {
    const existingCustomer = await Customer.findOne({
      email: email.toLowerCase(),
    });

    if (existingCustomer) {
      // Email already exists
      console.log(email, "already exists");
      res.send("exists");
    } else {
      console.log(email, "does not exists");
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
        from: "moeezkhattak86@gmail.com",
        to: email,
        subject: `Trendify Account Verification`,
        text: `Captcha Code: ${message}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send(`error`);
        } else {
          console.log("Email sent ", info.response);
          res.send("Email sent");
        }
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Error checking email existence." });
  }
};

module.exports = {
  addCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  authCustomer,
  sendCaptcha,
};
