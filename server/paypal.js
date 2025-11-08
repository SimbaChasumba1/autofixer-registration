import express from "express";
import paypal from "@paypal/checkout-server-sdk";  // PayPal Checkout SDK

// Environment setup
const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

// For testing, use: paypal.core.SandboxEnvironment() instead of LiveEnvironment
// const environment = new paypal.core.SandboxEnvironment(
//   process.env.PAYPAL_CLIENT_ID,
//   process.env.PAYPAL_CLIENT_SECRET
// );

const client = new paypal.core.PayPalHttpClient(environment);

// Initialize the router
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
            currency_code: "USD",  // Or dynamically set this
            value: req.body.amount || "1.00", // Use the amount sent in the request, or default to 1.00
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

// Export the router
export default router;
