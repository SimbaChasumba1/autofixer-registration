// index.js
import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { uploadVideo } from "./supabase.js";
import { createPayPalOrder, getPayPalAccessToken } from "./paypal.js"; // Import PayPal logic from paypal.js
import nodeCron from "node-cron";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const uploads = multer();
const registrations = [];

let paypalAccessToken = null;
let tokenExpiryTime = 0;

const PAYPAL_API_URL = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';  // Ensure you're using the correct live endpoint
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// Function to refresh PayPal token (This now uses paypal.js)
async function refreshPayPalToken() {
  try {
    paypalAccessToken = await getPayPalAccessToken(); // Get valid token from paypal.js
    tokenExpiryTime = Date.now() + 1000 * 60 * 60 * 8; // Set token expiry to 8 hours
    console.log('PayPal token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing PayPal token:', error);
  }
}

// Automatically refresh the token every 8 hours
nodeCron.schedule('0 */8 * * *', refreshPayPalToken);

// Initial token refresh when the app starts
refreshPayPalToken();

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

// Create PayPal order (Refactored to use paypal.js function)
app.post("/api/create-paypal-order", async (req, res) => {
  const { amount } = req.body;

  try {
    const token = await getPayPalAccessToken(); // Get the valid PayPal token

    // Log the token to ensure it's valid before using
    console.log("Using PayPal Access Token:", token);

    const orderData = await createPayPalOrder(amount, token); // Use paypal.js to create the order

    if (orderData.error) {
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
    // Find the registration based on the provided registrationId
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
      // Update the registration payment status
      registration.paid = true;
      
      // Here you can also update registration details in a database if needed
      // For example, adding the video link or any other info you want to attach
      
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
