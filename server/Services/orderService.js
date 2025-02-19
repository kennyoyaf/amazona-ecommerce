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

const getOrderById = async id => await Order.findById(id);

const updateOrderPayment = async (id, paymentData) => {
  try {
    const order = await Order.findById(id);
    if (!order) return [false, 'Order not found'];

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentData.id,
      status: paymentData.status,
      email_address: paymentData.email_address
    };

    const updatedOrder = await order.save();
    return [true, updatedOrder];
  } catch (error) {
    return [false, error.message];
  }
};

module.exports = { saveOrder, getOrderById, updateOrderPayment };
