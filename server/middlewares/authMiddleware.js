const { checkJwt } = require('../Services/userService');
const { responseHandler } = require('../utils/responseHandler');

// Middleware to validate user jwt token
const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(' ')[1];
    const check = await checkJwt(token);

    const { id, exp, err } = check;
    if (err) {
      return responseHandler(res, err, 401, false, '');
    }

    if (id && exp < Date.now()) {
      req.id = id;

      next();
      return;
    } else {
      return responseHandler(res, 'Expired token', 401, false, '');
    }
  }
  return responseHandler(res, 'No authorization token found', 401, false, '');
};

module.exports = {
  verifyToken
};
