app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      return res.status(400).json({ error: "Missing PayPal credentials" });
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

    // LIVE PayPal token URL
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Error getting PayPal token:", tokenData);
      return res.status(500).json({ error: "Error getting PayPal token", details: tokenData });
    }

    // Create order
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error("PayPal order creation error:", orderData);
      return res.status(500).json({ error: "PayPal order creation failed", details: orderData });
    }

    res.json(orderData);

  } catch (err) {
    console.error("PayPal error:", err);
    res.status(500).json({ error: "PayPal error", details: err.message });
  }
});
