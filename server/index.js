import express from "express";

import cors from "cors";



const app = express();

app.use(cors());

app.use(express.json());



let registrations = [];



// Get all registrations

app.get("/api/donors", (req, res) => {

  res.json(registrations);

});



// Register endpoint

app.post("/api/register", (req, res) => {

  try {

    const { name, email, phone, amount, message } = req.body;

    if (!name || !email || !phone) {

      return res.status(400).json({ success: false, message: "All fields required" });

    }

    registrations.push({ name, email, phone, amount, message });

    console.log("✅ New registration:", name, email, phone, amount);

    res.json({ success: true, message: "Registration saved" });

  } catch (err) {

    console.error("Server error:", err);

    res.status(500).json({ success: false, message: "Server error" });

  }

});



// Mock payment

app.post("/api/pay", (req, res) => {

  const { name } = req.body;

  console.log("Processing payment for:", name);

  setTimeout(() => res.json({ success: true, message: "Payment processed successfully!" }), 1000);

});



app.listen(5000, () => console.log("Server running on port 5000"));