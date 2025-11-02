import express from "express";

import cors from "cors";

import multer from "multer";

import fs from "fs";

import path from "path";



const app = express();

app.use(cors());

app.use(express.json());



// ensure uploads dir

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);



// multer disk storage

const storage = multer.diskStorage({

  destination: (req, file, cb) => cb(null, uploadsDir),

  filename: (req, file, cb) => {

    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    cb(null, safe);

  }

});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB



const REG_FILE = path.join(process.cwd(), "registrations.json");



function readRegs() {

  if (!fs.existsSync(REG_FILE)) return [];

  try {

    return JSON.parse(fs.readFileSync(REG_FILE));

  } catch (e) {

    console.error("Failed read regs", e);

    return [];

  }

}

function writeRegs(arr) {

  fs.writeFileSync(REG_FILE, JSON.stringify(arr, null, 2));

}



// POST /api/register - receives form + optional video + optional paymentMock

app.post("/api/register", upload.single("video"), (req, res) => {

  try {

    const { name, email, phone, paymentMock } = req.body;

    const file = req.file;



    if (!name || !email || !phone) {

      return res.status(400).json({ error: "Missing required fields" });

    }



    const registration = {

      id: Date.now(),

      name,

      email,

      phone,

      videoFilename: file ? file.filename : null,

      videoOriginalName: file ? file.originalname : null,

      payment: paymentMock ? JSON.parse(paymentMock) : { amount: 20, method: "mock" },

      createdAt: new Date().toISOString()

    };



    const arr = readRegs();

    arr.push(registration);

    writeRegs(arr);



    return res.json({ ok: true, registration });

  } catch (err) {

    console.error("Register error:", err);

    return res.status(500).json({ error: "Server error" });

  }

});



// GET /api/registrations

app.get("/api/registrations", (req, res) => {

  const arr = readRegs();

  res.json(arr);

});



// serve uploads for dev only

app.get("/uploads/:name", (req, res) => {

  const file = path.join(uploadsDir, req.params.name);

  if (fs.existsSync(file)) res.sendFile(file);

  else res.status(404).send("Not found");

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`✅ Server running on port ${PORT}`);

});

