import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { uploadFileToDriveFromBuffer } from "./drive.js";  // Google Drive logic
import paypalRoutes from "./paypal.js";  // PayPal routes

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse incoming JSON requests

// Use PayPal routes (only PayPal-related routes)
app.use("/paypal", paypalRoutes);  // All PayPal-related routes will be prefixed with `/paypal`

// Google Drive upload and registration routes
const registrations = [];

// Route for creating a pending registration and uploading a video to Google Drive
app.post("/api/create-pending", multer().single("video"), async (req, res) => {
  try {
    // Destructure data from the request body
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    // Handle file if provided
    const tempFile = req.file ? req.file : null;

    // Create registration object
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
      driveWebView: null,
      createdAt: new Date().toISOString()
    };

    // Store the registration temporarily
    registrations.push(newReg);

    // If a video file is uploaded, upload to Google Drive
    if (tempFile) {
      const { buffer, originalname } = tempFile;
      const driveRes = await uploadFileToDriveFromBuffer(buffer, originalname);
      newReg.driveFileId = driveRes.id;
      newReg.driveWebView = driveRes.webViewLink;
    }

    // Respond with the registration info
    res.json({ id, registration: newReg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Health check endpoint (for server health check)
app.get("/health", (req, res) => res.json({ ok: true }));

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
