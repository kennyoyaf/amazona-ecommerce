const {
  createOrder,
  getOrder,
  updateOrder,
  getAllOrders
} = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/order/details', verifyToken, createOrder);
router.get('/order/:id', verifyToken, getOrder);
router.get('/order-history', verifyToken, getAllOrders);
router.put('/order/pay/:id', verifyToken, updateOrder);

module.exports = router;
