const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { translateError } = require('../utils/mongo_helper');
const User = require('../model/User');
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const userCreation = async ({ firstName, lastName, email, password, role }) => {
  try {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: await hashedPassword(password),
      role
    });

    if (await newUser.save()) {
      return [true, createAccessToken(newUser._id), newUser];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

//To hash pasword
const hashedPassword = async password => {
  const salt = await bcrypt.genSalt(15);
  return await bcrypt.hash(password, salt);
};

// create and sign json web token for a user
const signJwt = id => {
  const token = jwt.sign({ id }, TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 1
  });
  return { token };
};

const createAccessToken = id => {
  const accessToken = jwt.sign({ id }, TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24
  });
  return { accessToken };
};

const createRefreshToken = id => {
  const refreshToken = jwt.sign({ id }, TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 30
  });
  return { refreshToken };
};

//To validate user password
const validatePassword = async (formPassword, dbPassword) =>
  await bcrypt.compare(formPassword, dbPassword);

//To verify user's Jwt
const checkJwt = async jwtID => {
  try {
    return await jwt.verify(jwtID, TOKEN_SECRET);
  } catch (error) {
    return { err: error.message };
  }
};
const getUserByEmail = async email => await User.findOne({ email }).exec();

const getUserRole = async () => await User.findOne({ role: 'admin' }).exec();

const getUserByIDWithOutPassword = async id =>
  await User.findById(id).select('-password');

const updateUserUsingId = async (id, details) =>
  await User.findByIdAndUpdate(id, details, { new: true });

const findUserUsingDetails = async details =>
  await User.findOne(details).exec();

module.exports = {
  userCreation,
  getUserByIDWithOutPassword,
  getUserByEmail,
  validatePassword,
  signJwt,
  checkJwt,
  createAccessToken,
  createRefreshToken,
  updateUserUsingId,
  findUserUsingDetails,
  getUserRole
};
