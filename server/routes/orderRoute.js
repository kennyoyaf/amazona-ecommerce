const { createOrder, getOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/order/details', verifyToken, createOrder);
router.get('/order/:id', verifyToken, getOrder);

module.exports = router;
