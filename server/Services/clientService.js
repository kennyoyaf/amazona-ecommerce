const { userCreation } = require('./userService');

const clientCreation = async ({ firstName, lastName, email, password }) => {
  let newUser = await userCreation({
    firstName,
    lastName,
    email,
    password,
    role: 'client'
  });

  return newUser;
};

module.exports = {
  clientCreation
};
