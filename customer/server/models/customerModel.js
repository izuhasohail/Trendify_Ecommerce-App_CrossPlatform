const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    deliveryAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash the password before saving to the database
customerSchema.pre("save", async function (next) {
  const customer = this;

  if (!customer.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(customer.password, salt);
    customer.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Create a model using the schema
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
