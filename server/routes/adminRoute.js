const {
  adminSignup,
  adminLogin,
  adminDetails,
  handleAdminLogout,
  handleAdminRefreshToken
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
// const { checkAdmin } = require('../middlewares/checkAdmin');
const router = require('express').Router();

router.post('/admin/auth/signup', adminSignup);
router.post('/admin/auth/login', adminLogin);
router.get('/admin/details', verifyToken, adminDetails);
router.post('/admin/logout', handleAdminLogout);
router.get('/admin/refresh', handleAdminRefreshToken);

module.exports = router;
