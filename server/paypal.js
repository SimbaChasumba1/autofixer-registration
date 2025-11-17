import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

let paypalAccessToken = null;
let tokenExpiryTime = 0;

const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// Function to refresh PayPal token
export async function refreshPayPalToken() {
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    console.log("Refreshing PayPal token...");

    try {
        const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
        });

        const data = await response.json();
        console.log('PayPal Token Response Status:', response.status);
        console.log('PayPal Token Response Data:', data);

        if (!response.ok || data.error) {
            throw new Error(`Failed to get new PayPal token: ${data.error_description || 'Unknown error'}`);
        }

        paypalAccessToken = data.access_token;
        tokenExpiryTime = Date.now() + data.expires_in * 1000; // Set the new expiration time
        console.log('PayPal token refreshed successfully:', paypalAccessToken); // Log the token for debugging
    } catch (error) {
        console.error('Error refreshing PayPal token:', error.message);
    }
}

// Function to check and get a valid PayPal token
export async function getPayPalAccessToken() {
    // Check if the token is expired before proceeding
    if (Date.now() >= tokenExpiryTime) {
        console.log('Token expired, refreshing...');
        await refreshPayPalToken(); // Refresh token if expired
    }

    // Check if token is still null
    if (!paypalAccessToken) {
        console.error('PayPal access token is still null!');
        throw new Error('No PayPal access token available!');
    }

    console.log('Returning PayPal access token:', paypalAccessToken); // Log the token before using it
    return paypalAccessToken;
}
