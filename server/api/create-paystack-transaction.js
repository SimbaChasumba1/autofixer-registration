const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); // Enable CORS

app.use(express.json());

// Example of the endpoint receiving the data
app.post("/api/create-paystack-transaction", async (req, res) => {
  console.log("Received request:", req.body);

  const { registrationId } = req.body;

  try {
    // Initialize Paystack transaction
    const paystackResponse = await paystack.transaction.initialize({
      amount: 2000, // Amount in kobo (2000k = 20 Naira)
      email: "customer@example.com", // Replace with actual customer email
      callback_url: `${process.env.FRONTEND_URL}/paystack/callback`, // Adjust as necessary
    });

    console.log("Paystack initialized:", paystackResponse);

    res.json({
      authorization_url: paystackResponse.data.authorization_url,
    });
  } catch (err) {
    console.error("Error during Paystack initialization:", err);
    res.status(500).json({ error: "Paystack initialization failed" });
  }
});

// Start server
app.listen(4041, () => {
  console.log("Server running on http://localhost:4041");
});
n