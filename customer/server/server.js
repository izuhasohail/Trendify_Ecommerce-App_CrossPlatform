require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const productRoutes = require("./routes/products");
const customerRoutes = require("./routes/customers");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");

let db;

//express app
 const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.get("/", (req, res) => {
  res.json({ mssg: "Welcome to the app" });
});

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// //connect to DB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("connected to database");
//     // listen to port
//     app.listen(process.env.PORT, () => {
//       console.log("listening for requests on port", process.env.PORT);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });


  // If the script is not running as part of a test, start the server
if (process.env.NODE_ENV !== 'test') {
  // const mongoose = require('mongoose');

  //connect to DB
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  }) 
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
}

module.exports=app