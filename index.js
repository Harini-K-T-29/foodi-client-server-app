const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const menuData = require("./menu.json");
const Menu = require("./api/models/Menu");
const path = require("path");

// console.log(process.env.DB_USER);

//middleware
app.use(express.json());
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-client.ywpwkid.mongodb.net/foodi-client?retryWrites=true&w=majority&appName=foodi-client`
  )
  .then(() => console.log("MongoDB Connected Succesfully"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

// jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2hr",
  });
  res.send({ token });
});

// app.post("/menu", async (req, res) => {
//   try {
//     await Menu.insertMany(menuData);
//     res.send({ message: "Inserted 92 menu items successfully" });
//   } catch (error) {
//     console.error("Insert failed:", error);
//     res.status(500).send({ error: "Failed to insert menu items" });
//   }
// });

// import routes here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const contactRoutes = require("./api/routes/contactRoutes");
const statsRoutes = require("./api/routes/statsRoutes");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);
app.use("/contact", contactRoutes);
app.use("/admin/stats", statsRoutes);

// stripe payment routes
// Create a PaymentIntent with the order amout and currency
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amout and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",

    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
