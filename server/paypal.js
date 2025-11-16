const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

let paypalAccessToken = null;
let tokenExpiryTime = 0;

const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// Function to refresh PayPal token
async function refreshPayPalToken() {
    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');

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

        if (data.error) {
            throw new Error('Failed to get new PayPal token');
        }

        paypalAccessToken = data.access_token;
        tokenExpiryTime = Date.now() + data.expires_in * 1000; // Set the new expiration time
        console.log('PayPal token refreshed successfully');
    } catch (error) {
        console.error('Error refreshing PayPal token:', error);
    }
}

// Function to check and get a valid PayPal token
async function getPayPalAccessToken() {
    if (Date.now() >= tokenExpiryTime) {
        await refreshPayPalToken(); // Refresh token if expired
    }
    return paypalAccessToken;
}

// Example API call to create a PayPal order
async function createPayPalOrder() {
    const token = await getPayPalAccessToken();
    
    try {
        const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: '10.00',
                        },
                    },
                ],
            }),
        });

        const data = await response.json();
        console.log('PayPal Order Created:', data);
    } catch (error) {
        console.error('Error creating PayPal order:', error);
    }
}

// Export functions so you can use them in your main app
module.exports = { createPayPalOrder, getPayPalAccessToken };
