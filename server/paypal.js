import express from "express";
import paypal from "@paypal/paypal-server-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Set up the PayPal environment (use LiveEnvironment for production or SandboxEnvironment for testing)
const environment = process.env.PAYPAL_ENV === 'production'
  ? new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    )
  : new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );

// Initialize the PayPal client
const client = new paypal.core.PayPalHttpClient(environment);

// Initialize the Express router
const router = express.Router();

// Route for creating a PayPal order
router.post("/create-paypal-order", async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",  // You can dynamically change this as needed
            value: req.body.amount || "1.00", // Use the amount passed in the request, or default to 1.00
          },
        },
      ],
    });

    // Execute the request to PayPal
    const order = await client.execute(request);

    // Send back the order ID and other relevant data
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("Error creating PayPal order:", err);
    res.status(500).send("Error creating PayPal order");
  }
});

// Export the router to be used in your main server file
export default router;
