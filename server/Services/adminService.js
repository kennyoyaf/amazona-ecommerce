const { userCreation } = require('./userService');

const adminCreation = async ({ firstName, lastName, email, password }) => {
  let createdAdmin = await userCreation({
    firstName,
    lastName,
    email,
    password,
    role: 'admin'
  });

  return createdAdmin;
};

module.exports = {
  adminCreation
};
