const { createOrder } = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');
const router = require('express').Router();

router.post('/order/details', verifyToken, createOrder);

module.exports = router;
