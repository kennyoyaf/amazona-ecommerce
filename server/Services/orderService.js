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

const updateOrderPayment = async (id, paymentData) =>
  await Order.findByIdAndUpdate(
    id,
    {
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: paymentData.id,
        status: paymentData.status,
        email_address: paymentData.email_address
      }
    },
    { new: true }
  );

const getAllTheOrders = async () => await Order.find();

module.exports = {
  saveOrder,
  getOrderById,
  updateOrderPayment,
  getAllTheOrders
};
