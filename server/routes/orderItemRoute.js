const { createOrderItem } = require('../controllers/orderItemController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/order-items/details', verifyToken, createOrderItem);

module.exports = router;
