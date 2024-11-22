const { getUserByID } = require('../Services/userService');
const { responseHandler } = require('../utils/responseHandler');

// Middleware to check if user is an admin
const checkAdmin = async (req, res, next) => {
  const { id } = req;

  if (id === undefined)
    return responseHandler(res, 'User is not an admin', 401, false, '');

  const theAdmin = await getUserByID(id);

  if (!theAdmin)
    return responseHandler(res, 'Admin is not available', 401, false, '');

  if (!(theAdmin.role == 'admin'))
    return responseHandler(res, 'User is not an admin', 401, false, '');

  req.user = theAdmin;

  next();
};

module.exports = {
  checkAdmin
};
