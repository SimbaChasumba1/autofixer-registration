import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { uploadVideo } from "./supabase.js"; 
import fetch from "node-fetch";
import { getPayPalAccessToken } from "./paypal.js"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploads = multer();
const registrations = [];


const PAYPAL_API_URL = "https://api-m.paypal.com";

app.post("/api/create-pending", uploads.single("video"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ error: "Missing fields" });

    if (!req.file)
      return res.status(400).json({ error: "Video required" });

    const { buffer, originalname, mimetype } = req.file;

    const videoUrl = await uploadVideo(
      buffer,
      `${Date.now()}-${originalname}`,
      mimetype
    );

    const id = Date.now().toString();
    const registration = { id, name, email, phone, videoUrl, paid: false };
    registrations.push(registration);

    res.json({ id, registration });
  } catch (err) {
    console.error("Pending Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/create-paypal-order", async (req, res) => {
  try {
    const amount = req.body.amount;

    // ALWAYS get a fresh valid token
    const accessToken = await getPayPalAccessToken();
    console.log("🔑 Using PayPal Access Token:", accessToken);

    const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
      console.error("❌ PayPal order creation failed:", orderData);
      return res.status(500).json({
        error: "PayPal order creation failed",
        details: orderData,
      });
    }

    res.json(orderData);
  } catch (err) {
    console.error("PayPal order error:", err);
    res.status(500).json({ error: "PayPal error", details: err.message });
  }
});

app.post("/api/paypal-payment-status", async (req, res) => {
  const { orderId, registrationId } = req.body;

  try {
    const registration = registrations.find((r) => r.id === registrationId);
    if (!registration)
      return res.status(404).json({ error: "Registration not found" });

    const accessToken = await getPayPalAccessToken();

    const orderRes = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const orderData = await orderRes.json();

    if (orderData.status === "COMPLETED") {
      registration.paid = true;
      return res.json({
        success: true,
        message: "Payment successful",
        registration,
      });
    }

    res.json({
      success: false,
      message: "Payment not completed",
      details: orderData,
    });
  } catch (err) {
    console.error("Payment status error:", err);
    res.status(500).json({
      error: "Error checking payment status",
      details: err.message,
    });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
