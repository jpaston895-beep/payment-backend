const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();

// ✅ middlewares (VERY IMPORTANT)
app.use(cors());
app.use(express.json());

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ test route
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

// ✅ CREATE ORDER ROUTE
app.post("/payments/create", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    });

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port", port);
});

