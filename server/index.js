import express from 'express';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadVideo } from './supabase.js';  // Assuming uploadVideo function is set up properly
import fetch from 'node-fetch';  // or global fetch if Node 18+

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploads = multer();

// Temporary in-memory storage for registrations
const registrations = [];

// Upload & create pending registration
app.post('/api/create-pending', uploads.single('video'), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: 'Missing fields' });
    if (!req.file) return res.status(400).json({ error: 'Video required' });

    const { buffer, originalname, mimetype } = req.file;

    // Upload video to Supabase
    const videoUrl = await uploadVideo(buffer, `${Date.now()}-${originalname}`, mimetype);

    // Store registration
    const id = Date.now().toString();
    const registration = { id, name, email, phone, videoUrl, paid: false };
    registrations.push(registration);

    res.json({ id, registration });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create PayPal order
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const auth = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`).toString('base64');
    
    // Set PayPal API URL based on environment
    const paypalUrl = process.env.PAYPAL_ENV === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';

    // Get token
    const tokenRes = await fetch(`${paypalUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Error getting PayPal token:', tokenData);
      return res.status(500).json({ error: 'Failed to get PayPal token' });
    }

    // Create order
    const orderRes = await fetch(`${paypalUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'USD', value: amount.toString() } }]
      })
    });

    const orderData = await orderRes.json();
    console.log('PayPal Order Data:', orderData);  // Debug logging

    if (!orderRes.ok) {
      console.error('Error creating PayPal order:', orderData);
      return res.status(500).json({ error: 'Failed to create PayPal order' });
    }

    // Send PayPal approval link to frontend
    const approvalLink = orderData.links.find(link => link.rel === 'approve').href;
    res.json({ approvalLink });
  } catch (err) {
    console.error('PayPal Order Error:', err);
    res.status(500).json({ error: 'PayPal error' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on ${port}`));
