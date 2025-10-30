import express from "express";

import multer from "multer";

import cors from "cors";

import fs from "fs";



const app = express();

app.use(cors());

app.use(express.json());



// 📂 Setup multer for mock video uploads

const upload = multer({ dest: "uploads/" });



// ✅ Registration route

app.post("/api/register", upload.single("video"), (req, res) => {

  const { name, email, phone } = req.body;

  const videoFile = req.file;



  if (!name || !email || !phone) {

    return res.status(400).json({ error: "All fields are required" });

  }



  // 💸 Simulate a R20 payment success

  const paymentStatus = "success";



  const registration = {

    name,

    email,

    phone,

    video: videoFile ? videoFile.filename : null,

    payment: paymentStatus,

    date: new Date().toISOString(),

  };



  // 🗂️ Save to a JSON file (mock database)

  const file = "registrations.json";

  const existing = fs.existsSync(file)

    ? JSON.parse(fs.readFileSync(file))

    : [];

  existing.push(registration);

  fs.writeFileSync(file, JSON.stringify(existing, null, 2));



  res.json({ message: "Registration successful", registration });

});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));