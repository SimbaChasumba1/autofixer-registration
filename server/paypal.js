import fetch from "node-fetch";

let cachedToken = null;
let tokenExpiry = 0;

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_SECRET;

export async function getPayPalAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("❌ PayPal env vars missing");
    throw new Error("Missing PayPal credentials");
  }

  // still valid?
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  console.log("🔄 Refreshing PayPal token...");

  const response = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    console.log("❌ PayPal Token Response:", data);
    throw new Error("Failed to get PayPal token: " + data.error_description);
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  console.log("✅ PayPal token refreshed");
  return cachedToken;
}
