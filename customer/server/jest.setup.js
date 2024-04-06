// jest.setup.js
require("dotenv").config();
const mongoose = require("mongoose");

beforeAll(async () => {
  // Connect to the database before running tests
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to the test database");
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("Closed the test database connection");
});
