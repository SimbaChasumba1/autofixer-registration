const fetch = require('node-fetch'); 
const { getPayPalAccessToken } = require('./paypal');

// Function to create PayPal order
const createPayPalOrder = async (amount) => {
  try {
    // Ensure that we have a valid access token
    const accessToken = await getPayPalAccessToken(); 

    // Make the request to PayPal API to create an order
    const response = await fetch('https://api.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { value: amount }, // The amount for the order
          },
        ],
      }),
    });

    // Parse the response from PayPal
    const data = await response.json();

    // Check if the PayPal order was successfully created
    if (response.ok) {
      console.log('PayPal Order Created:', data);
      return data; // Return the order data to be used later (like links for approval)
    } else {
      throw new Error('Error creating PayPal order');
    }
  } catch (error) {
    console.error('Error in creating PayPal order:', error);
    throw error; // Propagate the error so it can be caught in the higher level logic
  }
};

// Export the function so it can be used in other files
module.exports = { createPayPalOrder };
