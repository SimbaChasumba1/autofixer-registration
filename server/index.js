import express from "express";

import cors from "cors";

import multer from "multer";

import fs from "fs";

import path from "path";

import dotenv from "dotenv";

import qs from "qs";

import crypto from "crypto";

import { uploadFileToDrive, getAuth } from "./drive.js";



dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



const app = express();

app.use(cors());

app.use(express.json());



// directories

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const REG_FILE = path.join(process.cwd(), "registrations.json");

if (!fs.existsSync(REG_FILE)) fs.writeFileSync(REG_FILE, "[]");



// multer for file storage (temp)

const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, uploadsDir),

  filename: (req, file, cb) => {

    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    cb(null, safe);

  }

});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB



function readRegs() {

  try {

    return JSON.parse(fs.readFileSync(REG_FILE, "utf8") || "[]");

  } catch (e) {

    return [];

  }

}

function writeRegs(arr) {

  fs.writeFileSync(REG_FILE, JSON.stringify(arr, null, 2));

}



// ---------- TEMP UPLOAD ----------

// POST /api/upload-temp  (multipart/form-data) -> returns { tempId, originalName }

app.post("/api/upload-temp", upload.single("video"), (req, res) => {

  try {

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    return res.json({ tempId: req.file.filename, originalName: req.file.originalname });

  } catch (err) {

    console.error("upload-temp error", err);

    return res.status(500).json({ error: "Server error" });

  }

});



// ---------- CREATE PENDING REGISTRATION ----------

// POST /api/create-pending { name, email, phone, tempId? } -> returns { id }

app.post("/api/create-pending", (req, res) => {

  try {

    const { name, email, phone, tempId } = req.body;

    if (!name || !email || !phone) return res.status(400).json({ error: "Missing fields" });

    const regs = readRegs();

    const id = Date.now().toString();

    const newReg = {

      id,

      name, email, phone,

      tempId: tempId || null,

      driveFileId: null,

      driveWebView: null,

      paid: false,

      createdAt: new Date().toISOString()

    };

    regs.push(newReg);

    writeRegs(regs);

    return res.json({ id, registration: newReg });

  } catch (err) {

    console.error("create-pending err", err);

    return res.status(500).json({ error: "Server error" });

  }

});



// ---------- PayFast integration helpers ----------

const PAYFAST_BASE = process.env.PAYFAST_SANDBOX === "true"

  ? "https://sandbox.payfast.co.za/eng/process"

  : "https://www.payfast.co.za/eng/process";



function generatePayfastSignature(data) {

  // payfast signature: build ordered string of non-empty values, append passphrase if present, md5

  const passphrase = process.env.PAYFAST_PASS_PHRASE || "";

  // remove empty and signature

  const keys = Object.keys(data).filter(k => data[k] !== undefined && data[k] !== null && String(data[k]).length > 0 && k !== "signature").sort();

  const str = keys.map(k => `${k}=${data[k]}`).join("&");

  const toHash = passphrase ? `${str}&passphrase=${passphrase}` : str;

  return crypto.createHash("md5").update(toHash).digest("hex");

}



// POST /api/initiate-payfast { amount, registrationId }

app.post("/api/initiate-payfast", async (req, res) => {

  try {

    const { amount, registrationId } = req.body;

    if (!amount || !registrationId) return res.status(400).json({ error: "Missing amount or registrationId" });

    const merchant_id = process.env.PAYFAST_MERCHANT_ID;

    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;

    const return_url = process.env.PAYFAST_RETURN_URL;

    const cancel_url = process.env.PAYFAST_CANCEL_URL || return_url;

    const notify_url = process.env.PAYFAST_NOTIFY_URL;



    // find registration for name/email

    const regs = readRegs();

    const reg = regs.find(r => String(r.id) === String(registrationId));

    if (!reg) return res.status(404).json({ error: "Registration not found" });



    const pfData = {

      merchant_id,

      merchant_key,

      return_url,

      cancel_url,

      notify_url,

      name_first: (reg.name || "").split(" ")[0] || reg.name,

      name_last: (reg.name || "").split(" ").slice(1).join(" ") || "",

      email_address: reg.email,

      m_payment_id: registrationId,

      amount: parseFloat(amount).toFixed(2),

      item_name: "AutoFixer registration"

    };



    pfData.signature = generatePayfastSignature(pfData);

    const qsData = qs.stringify(pfData);

    const url = `${PAYFAST_BASE}?${qsData}`;

    return res.json({ url });

  } catch (err) {

    console.error("initiate-payfast err", err);

    return res.status(500).json({ error: "Server error" });

  }

});



// ---------- PayFast IPN (notify_url) ----------

// PayFast will POST form-urlencoded data to this endpoint

app.post("/api/payfast-ipn", express.urlencoded({ extended: true }), async (req, res) => {

  try {

    const ipnData = req.body;

    // TODO (production): verify IPN by doing server-to-server verification with PayFast

    // For sandbox/demo we proceed with basic check: m_payment_id present

    const registrationId = ipnData.m_payment_id;

    const paymentStatus = ipnData.payment_status || ipnData.status || "UNKNOWN";



    // mark paid if status indicates complete

    const regs = readRegs();

    const regIndex = regs.findIndex(r => String(r.id) === String(registrationId));

    if (regIndex === -1) {

      console.warn("IPN: registration not found", registrationId);

      res.status(200).send("OK");

      return;

    }



    // if payment_status is COMPLETE -> finalize

    // In PayFast sandbox, check ipnData.payment_status === 'COMPLETE'

    if (String(paymentStatus).toUpperCase() === "COMPLETE" || String(paymentStatus).toUpperCase() === "COMPLETE") {

      // upload temp file to Drive if tempId exists

      const reg = regs[regIndex];

      if (reg.tempId) {

        const localPath = path.join(uploadsDir, reg.tempId);

        if (fs.existsSync(localPath)) {

          try {

            const driveRes = await uploadFileToDrive(localPath, reg.tempId, undefined);

            // remove local file

            fs.unlinkSync(localPath);

            reg.driveFileId = driveRes.id;

            reg.driveWebView = driveRes.webViewLink || null;

          } catch (uerr) {

            console.error("Drive upload error", uerr);

          }

        } else {

          console.warn("Temp file not found for upload", localPath);

        }

      }

      reg.paid = true;

      reg.payfastRaw = ipnData;

      reg.paidAt = new Date().toISOString();

      regs[regIndex] = reg;

      writeRegs(regs);

    } else {

      // log IPN but don't mark paid

      regs[regIndex].payfastRaw = ipnData;

      writeRegs(regs);

    }



    // reply 200 quickly

    res.status(200).send("OK");

  } catch (err) {

    console.error("IPN handler error", err);

    res.status(500).send("ERR");

  }

});



// ---------- Dev helper endpoints ----------

app.get("/api/registrations", (req, res) => {

  res.json(readRegs());

});



// optional serve uploads for dev

app.get("/uploads/:name", (req, res) => {

  const p = path.join(uploadsDir, req.params.name);

  if (fs.existsSync(p)) res.sendFile(p);

  else res.status(404).send("Not found");

});



// health

app.get("/health", (req, res) => res.json({ ok: true }));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));