const Order = require('../model/Order');

const saveOrder = async body => {
  try {
    const theOrder = new Order(body);
    return (await theOrder.save())
      ? [true, theOrder]
      : [false, 'Error saving Order'];
  } catch (error) {
    return [false, error];
  }
};

module.exports = { saveOrder };
