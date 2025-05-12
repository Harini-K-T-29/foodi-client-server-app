const express = require("express");
const mongoose = require("mongoose");
const Payment = require("../models/Payments");
const router = express.Router();
const Cart = require("../models/Carts");
const ObjectId = mongoose.Types.ObjectId;

// verify token
const verifyToken = require("../middleware/verifyToken");
const verfiyAdmin = require("../middleware/verifyAdmin");

// post payment inform to db
router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;
  try {
    // delete cart after payment request
    const cartIds = payment.cartItems.map((id) => new ObjectId(id));
    // Fetch full cart items by IDs
    const cartItems = await Cart.find({ _id: { $in: cartIds } });

    // Build menuItems from cart fields
    const enrichedMenuItems = cartItems.map((cart) => ({
      name: cart.name,
      quantity: cart.quantity || 1,
      image: cart.image,
      price: cart.price,
    }));
    // Save enriched payment
    const paymentRequest = await Payment.create({
      ...payment,
      menuItems: enrichedMenuItems,
    });
    const deletedCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } });

    res.status(200).json({ paymentRequest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const email = req.query.email;

    let query = {};
    if (email) {
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).json({ message: "Forbidden Access" });
      }
      query = { email: email };
    }

    const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// PATCH route to update order status to "confirmed"
router.patch("/:id/confirm", verifyToken, verfiyAdmin, async (req, res) => {
  try {
    const paymentId = req.params.id;

    const updated = await Payment.findByIdAndUpdate(
      paymentId,
      { status: "confirmed" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Order confirmed", updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm order", error });
  }
});

// DELETE order by ID
router.delete("/:id", verifyToken, verfiyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Payment.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
});

router.get("/:id", async (req, res) => {
  const transactionId = req.params.id;
  try {
    const order = await Payment.findOne({ transactionId });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
});

module.exports = router;
