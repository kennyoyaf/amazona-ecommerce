const { getOrderById } = require('../Services/orderSchemaService');
const {
  checkJwt,
  getUserByIDWithOutPassword
} = require('../Services/userService');
const { responseHandler } = require('../utils/responseHandler');

// Middleware to validate user jwt token
const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  console.log({ bearerHeader });

  if (bearerHeader !== undefined) {
    const token = bearerHeader.split(' ')[1];

    console.log({ token });
    const check = await checkJwt(token);

    console.log({ check });

    const { id, exp, err } = check;

    console.log({ id });

    if (err) {
      return responseHandler(res, err, 401, false, '');
    }

    if (id && exp < Date.now()) {
      req.id = id;

      const theUser = await getUserByIDWithOutPassword(id);

      console.log({ theUser });

      if (!theUser)
        return responseHandler(res, 'User is not available', 401, false, '');

      const theOrder = await getOrderById(id);

      console.log({ theOrder });

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
