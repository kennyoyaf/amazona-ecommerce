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
  items = [],
  complete,
  cancel
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
        return_url: `http://localhost:3000/${complete}`, // Redirect after approval
        cancel_url: `http://localhost:3000/${cancel}`, // Redirect if user cancels
        user_action: 'PAY_NOW', // Forces "Pay Now" instead of "Continue",
        brand_name: 'Next Amazona'
      },
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: { currency_code: currency, value: amount }
            }
          },
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit_amount: { currency_code: currency, value: item.price },
            image_url: item.image
          }))
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create PayPal order: ${await response.text()}`);
  }

  return await response.json();
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
        Authorization: `Bearer ${accessToken.access_token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to capture PayPal order: ${await response.text()}`);
  }

  return await response.json();
}

module.exports = { createPayPalOrder, capturePayPalOrder };
