import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch"; // or native fetch in Node 18+
import crypto from "crypto";
import { uploadFileToDriveFromPath } from "./drive.js";

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

// TEMP uploads dir
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const upload = multer({ dest: uploadsDir, limits: { fileSize: 100 * 1024 * 1024 } });

// REGISTRATION FILE
const REG_FILE = path.join(process.cwd(), "registrations.json");
if (!fs.existsSync(REG_FILE)) fs.writeFileSync(REG_FILE, "[]");

function readRegs() {
  try { return JSON.parse(fs.readFileSync(REG_FILE, "utf8") || "[]"); }
  catch { return []; }
}

function writeRegs(arr) { fs.writeFileSync(REG_FILE, JSON.stringify(arr, null, 2)); }

// 1) Create pending registration
app.post("/api/create-pending", upload.single("video"), (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    const tempFile = req.file ? req.file.filename : null;
    const tempOriginal = req.file ? req.file.originalname : null;
    const id = Date.now().toString();

    const newReg = {
      id,
      name, email, phone,
      tempFile,
      tempOriginal,
      paid: false,
      paystackReference: null,
      driveFileId: null,
      createdAt: new Date().toISOString()
    };

    const regs = readRegs();
    regs.push(newReg);
    writeRegs(regs);

    return res.json({ id, registration: newReg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// 2) Create Paystack transaction
app.post("/api/create-paystack-transaction", async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) return res.status(400).json({ error: "Missing registrationId" });

    const regs = readRegs();
    const reg = regs.find(r => r.id === registrationId);
    if (!reg) return res.status(404).json({ error: "Registration not found" });

    const amountInKoboOrCents = 2000; // 20 ZAR/NGN

    const payload = {
      email: reg.email,
      amount: amountInKoboOrCents,
      metadata: { registrationId }
    };

    // Logging request to Paystack for debugging
    console.log('Initializing Paystack transaction for registration:', registrationId);

    const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // If Paystack returns an error or unsuccessful response
    if (!initRes.ok) {
      const errorJson = await initRes.json();
      console.error("Paystack initialization failed:", errorJson);
      return res.status(500).json({ error: "Paystack initialization failed", details: errorJson });
    }

    const initJson = await initRes.json();

    if (!initJson.status) {
      console.error("Paystack init failed, no status in response:", initJson);
      return res.status(500).json({ error: "Paystack initialization failed", details: initJson });
    }

    reg.paystackReference = initJson.data.reference || null;
    writeRegs(regs);

    // Return Paystack authorization URL to the frontend
    return res.json({
      authorization_url: initJson.data.authorization_url,
      reference: initJson.data.reference
    });
  } catch (err) {
    console.error("Error initializing Paystack transaction:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// 3) Paystack webhook
app.post("/api/paystack/webhook", (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const raw = req.rawBody;  // Ensure this holds the raw request body, for signature verification
    const computed = crypto.createHmac("sha512", secret).update(raw).digest("hex");

    // Verify the Paystack signature
    if (signature !== computed) {
      console.warn("Paystack webhook signature mismatch");
      return res.status(400).send("Signature mismatch");
    }

    const event = req.body;

    if (event.event === "charge.success" || event.event === "payment.completed" || (event.data && event.data.status === "success")) {
      const data = event.data;
      const registrationId = data.metadata?.registrationId;
      const regs = readRegs();
      const idx = regs.findIndex(r => r.id === registrationId);

      if (idx !== -1) {
        regs[idx].paid = true;
        regs[idx].paidAt = new Date().toISOString();
        regs[idx].paystackReference = data.reference || regs[idx].paystackReference;

        const tempFile = regs[idx].tempFile;
        if (tempFile) {
          const localPath = path.join(uploadsDir, tempFile);
          if (fs.existsSync(localPath)) {
            uploadFileToDriveFromPath(localPath)
              .then((result) => {
                regs[idx].driveFileId = result.id || null;
                regs[idx].driveWebView = result.webViewLink || null;
                writeRegs(regs);
                try { fs.unlinkSync(localPath); } catch(e) {}
                console.log("Uploaded to Drive:", registrationId);
              })
              .catch(err => console.error("Drive upload error", err));
          }
        }

        writeRegs(regs);
      } else {
        console.warn("Registration not found:", registrationId);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error", err);
    res.status(500).send("Server error");
  }
});

// Dev endpoints
app.get("/api/registrations", (req, res) => res.json(readRegs()));
app.get("/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
