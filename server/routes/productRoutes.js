const {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct
} = require('../controllers/productController');

const router = require('express').Router();

router.post('/create-product', createProduct);
router.get('/get-product/:id', getProduct);
router.get('/get-all-products', getAllProducts);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
