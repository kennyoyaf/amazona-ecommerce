const express = require('express');
const paypalController = require('../controllers/paypalController');

const router = express.Router();

// Route to Create an Order (User Initiates Payment)
router.post('/create-order', paypalController.createOrder);

// Route to Capture an Order (User Confirms Payment)
router.post('/capture-order/:orderId', paypalController.captureOrder);

router.get('/success', paypalController.complete);
router.get('/cancel', paypalController.cancel);

router.get('/paypal-client-id', (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

module.exports = router;
