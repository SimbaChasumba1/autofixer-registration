import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { uploadVideo } from "./supabase.js"; 
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploads = multer();

// Temporary in-memory storage for registrations
const registrations = [];

// Upload & create pending registration
app.post("/api/create-pending", uploads.single("video"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });
    if (!req.file) return res.status(400).json({ error: "Video required" });

    const { buffer, originalname, mimetype } = req.file;

    // Upload video to Supabase
    const videoUrl = await uploadVideo(buffer, `${Date.now()}-${originalname}`, mimetype);

    // Store registration
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
  try {
    const { amount } = req.body;
    const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    // Base64 encode the client ID and secret for the Authorization header
    const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString("base64");

    // Get token from PayPal OAuth2
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",  // OAuth2 grant type
    });

    const tokenData = await tokenRes.json();

    // Log token response for debugging
    console.log("PayPal token response:", tokenData);

    // If PayPal responds with an error, log and send it back
    if (tokenData.error) {
      console.error("Error getting PayPal token:", tokenData);
      return res.status(500).json({ error: "Error getting PayPal token", details: tokenData });
    }

    // Create order with PayPal
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: amount },
          },
        ],
      }),
    });

    const orderData = await orderRes.json();

    // Log order creation response for debugging
    console.log("PayPal order response:", orderData);

    res.json(orderData);
  } catch (err) {
    console.error("PayPal order error:", err);
    res.status(500).json({ error: "PayPal error", details: err });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
