import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { uploadVideo } from "./supabase.js"; 
import fetch from "node-fetch";
import nodeCron from "node-cron";
import { getPayPalAccessToken } from "./paypal.js"; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const uploads = multer();
const registrations = []; 

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com'; 
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// Create pending registration endpoint
app.post("/api/create-pending", uploads.single("video"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });
    if (!req.file) return res.status(400).json({ error: "Video required" });

    const { buffer, originalname, mimetype } = req.file;
    const videoUrl = await uploadVideo(buffer, `${Date.now()}-${originalname}`, mimetype);

    const id = Date.now().toString();
    const registration = { id, name, email, phone, videoUrl, paid: false };
    registrations.push(registration);

    res.json({ id, registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create PayPal order
app.post("/api/create-paypal-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const paypalAccessToken = await getPayPalAccessToken(); // Ensure the token is valid
    console.log("Using PayPal Access Token:", paypalAccessToken); // Log the token to ensure it’s set

    const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paypalAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error('PayPal order creation failed:', orderData);
      return res.status(500).json({ error: "PayPal order creation failed", details: orderData });
    }

    res.json(orderData);
  } catch (err) {
    console.error("PayPal order error:", err);
    res.status(500).json({ error: "PayPal error", details: err });
  }
});

// Payment status update
app.post("/api/paypal-payment-status", async (req, res) => {
  const { orderId, registrationId } = req.body; // Expect both orderId and registrationId

  try {
    const registration = registrations.find(reg => reg.id === registrationId);
    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paypalAccessToken}`,
      },
    });

    const orderData = await orderRes.json();

    if (orderData.status === 'COMPLETED') {
      registration.paid = true;
      res.json({ success: true, message: "Payment successful", registration });
    } else {
      res.json({ success: false, message: "Payment not completed" });
    }
  } catch (err) {
    console.error("Error checking PayPal payment status:", err);
    res.status(500).json({ error: "Error checking payment status", details: err });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
