const OrderItem = require('../model/OrderItems');

const saveOrderItem = async body => {
  try {
    const theOrderItem = new OrderItem(body);
    return (await theOrderItem.save())
      ? [true, theOrderItem]
      : [false, 'Error saving Order'];
  } catch (error) {
    return [false, error];
  }
};

module.exports = { saveOrderItem };
