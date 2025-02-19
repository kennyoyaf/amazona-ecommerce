const {
  createPayPalOrder,
  capturePayPalOrder
} = require('../Services/paypalService');
const { responseHandler } = require('../utils/responseHandler');

const paypalController = {
  // Controller: Create a PayPal Order
  async createOrder(req, res) {
    try {
      const {
        amount,
        currency = 'USD',
        complete = 'success',
        cancel = 'cancel'
      } = req.body;
      if (!amount) {
        return responseHandler(res, 'Amount is required', 400, false, '');
      }

      const orderData = await createPayPalOrder(
        amount,
        currency,
        complete,
        cancel
      );

      if (!orderData || !orderData.links) {
        console.error('🚨 PayPal order creation failed:', orderData);
        return responseHandler(
          res,
          'PayPal order creation failed',
          500,
          false,
          ''
        );
      }

      // Extract only the "approve" link
      const approveLink = orderData.links.find(link => link.rel === 'approve');

      return res.status(201).json({ approve_url: approveLink.href });
    } catch (error) {
      console.error('PayPal Create Order Error:', error.message);
      return responseHandler(res, error.message, 500, false, '');
    }
  },

  // Controller: Capture a PayPal Order
  async captureOrder(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return responseHandler(res, 'Order ID is required', 400, false, '');
      }

      const captureData = await capturePayPalOrder(orderId);
      return res.status(200).json(captureData);
    } catch (error) {
      console.error('PayPal Capture Order Error:', error.message);
      return responseHandler(res, error.message, 500, false, '');
    }
  },

  async complete(req, res) {
    try {
      const { token } = req.query;
      if (!token)
        return responseHandler(res, 'Token is required', 400, false, '');

      console.log(token);

      const captureData = await capturePayPalOrder(token);
      responseHandler(res, 'Payment was successful.', 200, true, captureData);
    } catch (error) {
      responseHandler(res, error.message, 500, false, '');
    }
  },

  cancel(req, res) {
    res.send('Payment was unsuccessful.');
  }
};

module.exports = paypalController;
