const { clientCreation } = require('../Services/clientService');
const {
  clientLoginValidation,
  clientSignupValidation
} = require('../utils/validation');
const { responseHandler } = require('../utils/responseHandler');
const {
  getUserByEmail,
  validatePassword,
  // signJwt,
  findUserUsingDetails,
  getUserByIDWithOutPassword,
  createRefreshToken,
  createAccessToken,
  updateUserUsingId,
  checkJwt
} = require('../Services/userService');

const clientSignup = async (req, res) => {
  try {
    //validate req.body
    const { details } = await clientSignupValidation(req.body);
    if (details) {
      let allErrors = details.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }
    let checkMail = await getUserByEmail(req.body.email);

    if (checkMail) {
      return responseHandler(res, 'Email already exists', 400, false, '');
    }

    let theClient = await clientCreation(req.body);

    return theClient[0]
      ? responseHandler(res, 'User registered successfully', 201, true, {
          user: theClient[2],
          ...theClient[1]
        })
      : responseHandler(res, 'User could not be created', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false);
  }
};

const clientLogin = async (req, res) => {
  try {
    //validate req.body
    const { details } = await clientLoginValidation(req.body);
    if (details) {
      let allErrors = details.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }
    let checkMail = await getUserByEmail(req.body.email);

    const anyEmail = checkMail;

    if (!anyEmail) {
      return responseHandler(
        res,
        'Email or password is incorrect',
        400,
        false,
        ''
      );
    }

    if (anyEmail.role !== 'client')
      return responseHandler(
        res,
        'Email or Password is incorrect',
        400,
        false,
        ''
      );

    //validate incoming password with database password
    if (await validatePassword(req.body.password, anyEmail.password)) {
      let accessToken = createAccessToken(anyEmail._id);

      let noPassUser = await getUserByIDWithOutPassword(anyEmail._id);

      let refreshToken = createRefreshToken(anyEmail._id);

      let updateUser = await updateUserUsingId(anyEmail.id, refreshToken);

      if (!updateUser)
        return responseHandler(
          res,
          'Error updating User refresh token',
          400,
          false
        );

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 7
      });

      return responseHandler(res, 'Login Successful', 200, true, {
        ...accessToken,
        user: noPassUser
      });
    }
    return responseHandler(
      res,
      'Email or Password is incorrect',
      400,
      false,
      ''
    );
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const clientDetails = async (req, res) => {
  try {
    const { id } = req;

    if (id === undefined)
      return responseHandler(res, 'User is not available', 401, false, '');

    const theUser = await getUserByIDWithOutPassword(id);

    if (!theUser)
      return responseHandler(res, 'User is not available', 401, false, '');

    return theUser
      ? responseHandler(
          res,
          'User details successfully retrieved',
          200,
          true,
          theUser
        )
      : responseHandler(res, 'Unable retrieve user details', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const handleLogout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return responseHandler(res, 'No cookie found', 200, true, ''); //No content
    const { refreshToken } = cookies.jwt;

    const foundUser = await findUserUsingDetails({ refreshToken });

    if (!foundUser) {
      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None'
        // secure: true,
      });
      return responseHandler(res, 'No user with token found', 200, false, '');
    }

    const updateUser = await updateUserUsingId(foundUser._id, {
      refreshToken: ''
    });

    if (!updateUser)
      return responseHandler(
        res,
        'Error updating refreshToken',
        204,
        false,
        ''
      );

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None'
      // secure: true,
    });
    return responseHandler(res, 'User logged out successfully', 200, true, '');
  } catch (error) {
    return responseHandler(res, error.message, 403, false, '');
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies.jwt) {
      return responseHandler(res, 'No cookie found', 403, false, ''); //No content
    }

    const { refreshToken } = cookies.jwt;

    const foundUser = await findUserUsingDetails({ refreshToken });

    if (!foundUser) {
      return responseHandler(res, 'No user found', 403, false, ''); //No content
    }

    const check = await checkJwt(refreshToken);

    const { id, exp, err } = check;

    if (err) {
      return responseHandler(res, err, 403, false, 'Invalid Token');
    }

    if (id && exp < Date.now()) {
      let accessToken = createAccessToken(foundUser.id);
      let noPassUser = await getUserByIDWithOutPassword(foundUser.id);

      return responseHandler(res, 'Access token refreshed', 200, true, {
        user: noPassUser,
        ...accessToken
      });
    } else {
      return responseHandler(res, 'Expired token', 403, false, '');
    }
  } catch (error) {
    return responseHandler(res, error.message, 403, false, '');
  }
};

module.exports = {
  clientSignup,
  clientLogin,
  clientDetails,
  handleLogout,
  handleRefreshToken
};
