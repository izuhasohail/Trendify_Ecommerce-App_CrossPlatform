const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// Hash the password before saving to the database
adminSchema.pre("save", async function (next) {
  const admin = this;

  if (!admin.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(admin.password, salt);
    admin.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

// Create a model using the schema
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;