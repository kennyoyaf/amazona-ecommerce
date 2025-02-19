const {
  createOrder,
  getOrder,
  updateOrder
} = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/order/details', verifyToken, createOrder);
router.get('/order/:id', verifyToken, getOrder);
router.patch('/order/:id/pay', verifyToken, updateOrder);

module.exports = router;
