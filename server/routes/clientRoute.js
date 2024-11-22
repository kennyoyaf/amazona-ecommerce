const {
  clientDetails,
  clientLogin,
  clientSignup,
  handleLogout,
  handleRefreshToken
} = require('../controllers/clientController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.post('/client/auth/signup', clientSignup);
router.post('/client/auth/login', clientLogin);
router.get('/client/details', verifyToken, clientDetails);
router.post('/logout', handleLogout);
router.get('/refresh', handleRefreshToken);

module.exports = router;
