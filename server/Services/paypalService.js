require('dotenv').config();
const fetch = require('node-fetch');

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE_URL = 'https://api-m.sandbox.paypal.com';

// Function to get PayPal Access Token
async function getPayPalAccessToken() {
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get PayPal access token: ${await response.text()}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

// Function to Create a PayPal Order
async function createPayPalOrder(
  amount,
  currency = 'USD',
  complete = 'success',
  cancel = 'cancel'
) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      application_context: {
        return_url: `http://localhost:4000/product/${complete}`, // Redirect after approval
        cancel_url: `http://localhost:4000/product/${cancel}`, // Redirect if user cancels
        user_action: 'PAY_NOW', // Forces "Pay Now" instead of "Continue",
        brand_name: 'Next Amazona'
      },
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString()
          }
        }
      ]
    })
  });

  const order = await response.json();
  // console.log(order);

  if (!order.id) {
    return { success: false, message: 'Failed to create PayPal order' };
  }

  return order; // ✅ Return a valid response
}

// Function to Capture a PayPal Order (Complete the Payment)
async function capturePayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to capture PayPal order: ${await response.text()}`);
  }

  return await response.json();
}

module.exports = { createPayPalOrder, capturePayPalOrder };
