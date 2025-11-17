import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

let payPalAccessToken = null;
let tokenExpiration = null; // Token expiration time

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Function to check if the token has expired
const isTokenExpired = () => {
  if (!payPalAccessToken || !tokenExpiration) return true;
  return Date.now() > tokenExpiration; // Check if the current time is past the token expiration
};

// Function to get PayPal Access Token (and refresh if expired)
const getPayPalAccessToken = async () => {
  if (!payPalAccessToken || isTokenExpired()) {
    console.log("Refreshing PayPal token...");

    try {
      // Fetch new token from PayPal
      const response = await fetch('https://api.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
      });

      if (response.ok) {
        const data = await response.json();
        payPalAccessToken = data.access_token;
        tokenExpiration = Date.now() + (data.expires_in * 1000); // Store token expiry time (in milliseconds)
        console.log("New PayPal token obtained:", payPalAccessToken);
      } else {
        throw new Error('Failed to refresh PayPal token');
      }
    } catch (error) {
      console.error('Error refreshing PayPal token:', error);
    }
  }

  return payPalAccessToken;
};

module.exports = { getPayPalAccessToken };