import paypal from 'paypal-rest-sdk'; // Import paypal-rest-sdk

console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID);
console.log('PayPal Secret:', process.env.PAYPAL_SECRET);

// Set up the PayPal environment with your credentials
paypal.configure({
  mode: 'live', // Change to 'sandbox' for testing
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

// Initialize the router (if you're using Express for routing)
import express from 'express';
const router = express.Router();

// Route for creating a PayPal order
router.post("/create-paypal-order", async (req, res) => {
  try {
    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [
        {
          amount: {
            currency: "USD",  // Or dynamically set this
            total: req.body.amount || "1.00", // Use the amount sent in the request, or default to 1.00
          },
          description: "Payment for order",
        },
      ],
      redirect_urls: {
        return_url: "http://localhost:5000/paypal/success",
        cancel_url: "http://localhost:5000/paypal/cancel",
      },
    };

    // Create the PayPal payment
    paypal.payment.create(paymentData, function (error, payment) {
      if (error) {
        console.error("Error creating PayPal payment:", error);
        res.status(500).send("Error creating PayPal order");
      } else {
        // Redirect the user to the PayPal approval URL
        const approvalUrl = payment.links.find(link => link.rel === "approval_url").href;
        res.json({ approvalUrl });
      }
    });
  } catch (err) {
    console.error("Error creating PayPal order:", err);
    res.status(500).send("Error creating PayPal order");
  }
});

// Export the router so you can use it in your Express app
export default router;
