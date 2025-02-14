const express = require('express');
const paypalController = require('../controllers/paypalController');

const router = express.Router();

// Route to Create an Order (User Initiates Payment)
router.post('/create-order', paypalController.createOrder);

// Route to Capture an Order (User Confirms Payment)
router.post('/capture-order/:orderId', paypalController.captureOrder);

router.get('/payment-success', paypalController.complete);
router.get('/payment-cancelled', paypalController.cancel);

module.exports = router;
