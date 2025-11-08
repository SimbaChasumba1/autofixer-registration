import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { uploadFileToDriveFromBuffer } from "./drive.js";  // Assuming this is your Google Drive logic
import paypalRoutes from "./paypal.js";  // PayPal routes

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());  // Parse incoming JSON requests

// Use PayPal routes (only PayPal-related routes)
app.use("/paypal", paypalRoutes);  // All PayPal-related routes will be prefixed with `/paypal`

// Google Drive upload and registration routes
const registrations = [];

// Route for creating a pending registration and uploading video to Google Drive
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

// Health check endpoint (for server health check)
app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
