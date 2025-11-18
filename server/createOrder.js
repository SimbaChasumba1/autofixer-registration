import fetch from "node-fetch";
import { getPayPalAccessToken } from "./paypal.js";

export async function createPayPalOrder(amount) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    "https://api-m.paypal.com/v2/checkout/orders",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "ZAR",
              value: amount,
            },
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data;
}
