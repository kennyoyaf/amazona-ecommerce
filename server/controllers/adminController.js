const {
  adminSignupValidation,
  adminLoginValidation
} = require('../utils/validation');
const { responseHandler } = require('../utils/responseHandler');
const {
  getUserByEmail,
  validatePassword,
  //   signJwt,
  getUserByIDWithOutPassword,
  createAccessToken,
  createRefreshToken,
  updateUserUsingId,
  findUserUsingDetails,
  checkJwt,
  getUserRole
} = require('../Services/userService');
const { adminCreation } = require('../Services/adminService');

const adminSignup = async (req, res) => {
  try {
    const { details } = await adminSignupValidation(req.body);
    if (details) {
      let allErrors = details.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }
    let checkMail = await getUserByEmail(req.body.email);

    let userRole = await getUserRole(req.body.role);

    if (userRole) {
      return responseHandler(res, 'Admin already exist', 400, false, '');
    }

    if (checkMail) {
      return responseHandler(res, 'Admin already exist', 400, false, '');
    }

    if (checkMail) {
      return responseHandler(res, 'Email already exists', 400, false, '');
    }

    let theAdmin = await adminCreation(req.body);
    console.log(theAdmin);

    return theAdmin[0]
      ? responseHandler(res, 'Admin registered successfully', 201, true, {
          user: theAdmin[2],
          ...theAdmin[1]
        })
      : responseHandler(res, 'Admin could not be created', 200, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const adminLogin = async (req, res) => {
  try {
    //validate req.body
    const { details } = await adminLoginValidation(req.body);
    if (details) {
      let allErrors = details.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }
    let checkMail = await getUserByEmail(req.body.email);

    const anyUsername = checkMail;

    if (!anyUsername) {
      return responseHandler(
        res,
        'Email password is incorrect',
        400,
        false,
        ''
      );
    }

    if (!(anyUsername.role == 'admin'))
      return responseHandler(
        res,
        'You are not an admin, Login as a client',
        400,
        false,
        ''
      );

    //validate incoming password with database password
    if (await validatePassword(req.body.password, anyUsername.password)) {
      let accessToken = createAccessToken(anyUsername._id);

      let noPassUser = await getUserByIDWithOutPassword(anyUsername._id);

      let refreshToken = createRefreshToken(anyUsername._id);

      let updateUser = await updateUserUsingId(anyUsername.id, refreshToken);

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

const adminDetails = async (req, res) => {
  try {
    const { id } = req;

    if (id === undefined)
      return responseHandler(res, 'Admin is not available', 401, false, '');

    const theUser = await getUserByIDWithOutPassword(id);

    if (!theUser)
      return responseHandler(res, 'Admin is not available', 401, false, '');

    return theUser
      ? responseHandler(
          res,
          'Admin details successfully retrieved',
          200,
          true,
          theUser
        )
      : responseHandler(res, 'Unable retrieve Admin details', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const handleAdminLogout = async (req, res) => {
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
      return responseHandler(res, 'No Admin with token found', 200, false, '');
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
    return responseHandler(res, 'Admin logged out successfully', 200, true, '');
  } catch (error) {
    return responseHandler(res, error.message, 403, false, '');
  }
};

const handleAdminRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies.jwt) {
      return responseHandler(res, 'No cookie found', 403, false, ''); //No content
    }

    const { refreshToken } = cookies.jwt;

    const foundUser = await findUserUsingDetails({ refreshToken });

    if (!foundUser) {
      return responseHandler(res, 'No Admin found', 403, false, ''); //No content
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
  adminLogin,
  adminSignup,
  adminDetails,
  handleAdminLogout,
  handleAdminRefreshToken
};
