const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { responseHandler } = require('../utils/responseHandler');

module.exports = async function auth(req, res, next) {
  const token = req.header('auth-token');
  if (!token) res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verified);
    const existingUser = await User.findById(verified._id);
    console.log(existingUser);
    if (!existingUser)
      return responseHandler(
        res,
        'User is not in the database',
        200,
        false,
        ''
      );

    req.user = { id: existingUser._id, email: existingUser.email };
    console.log(req.user);
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};
