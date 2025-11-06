import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Or native fetch in Node 18+
import { uploadFileToDriveFromBuffer } from "./drive.js"; // Updated for buffer upload

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*",  // For now, allows all origins (adjust for production)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

// REGISTRATION FILE (in-memory storage for simplicity)
const registrations = [];

// 1) Create a pending registration
app.post("/api/create-pending", multer().single("video"), async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    const tempFile = req.file ? req.file : null;
    const id = Date.now().toString();

    const newReg = {
      id,
      name,
      email,
      phone,
      tempFile,
      paid: false,
      paystackReference: null,
      driveFileId: null,
      createdAt: new Date().toISOString()
    };

    // Store registration temporarily
    registrations.push(newReg);

    // If a file is uploaded, upload to Google Drive
    if (tempFile) {
      const { buffer, originalname } = tempFile;
      const driveRes = await uploadFileToDriveFromBuffer(buffer, originalname);
      newReg.driveFileId = driveRes.id;
      newReg.driveWebView = driveRes.webViewLink;
    }

    res.json({ id, registration: newReg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2) Create Paystack transaction (same as before)
app.post("/api/create-paystack-transaction", async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) return res.status(400).json({ error: "Missing registrationId" });

    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return res.status(404).json({ error: "Registration not found" });

    const payload = {
      email: reg.email,
      amount: 2000,  // Example amount
      metadata: { registrationId }
    };

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const initJson = await initRes.json();
    if (!initJson.status) {
      console.error("Paystack init failed:", initJson);
      return res.status(500).json({ error: "Paystack initialization failed" });
    }

    reg.paystackReference = initJson.data.reference || null;

    res.json({
      authorization_url: initJson.data.authorization_url,
      reference: initJson.data.reference
    });
  } catch (err) {
    console.error("Error initializing Paystack transaction:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
