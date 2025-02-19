const {
  saveOrder,
  getOrderById,
  updateOrderPayment
} = require('../Services/orderService');
const { responseHandler } = require('../utils/responseHandler');
const { orderValidation, validateId } = require('../utils/validation');

const createOrder = async (req, res) => {
  try {
    const { details } = await orderValidation(req.body);

    if (details) {
      const validationErrors = details.map(detail =>
        detail.message.replace(/"/g, '')
      );
      return responseHandler(res, validationErrors, 400, false, '');
    }

    const { ...item } = req.body;

    // Get the buyer's ID from req.user
    const buyerId = req.id;

    // Attach the buyer's ID to the order
    const orderData = { ...item, user: buyerId };

    const savedOrder = await saveOrder(orderData);

    if (!savedOrder[0]) return responseHandler(res, savedOrder[1], false, '');

    return savedOrder[0]
      ? responseHandler(
          res,
          'Order created successfully',
          201,
          true,
          savedOrder[1]
        )
      : responseHandler(res, savedOrder[1], false, '');
  } catch (error) {
    return responseHandler(res, error.message, 500, false, '');
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const orderId = await getOrderById(id);
    console.log(orderId);

    if (!orderId) {
      return responseHandler(res, 'order not found', 404, false, '');
    }

    return orderId
      ? responseHandler(res, 'order retrieved successfully', 200, true, orderId)
      : responseHandler(res, 'Error getting order', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const updateOrder = async (req, res) => {
  try {
    const { error } = orderValidation(req.body);

    if (error) {
      const validationErrors = error.details.map(detail =>
        detail.message.replace(/"/g, '')
      );
      return responseHandler(res, validationErrors, 400, false, '');
    }

    const { id } = req.params;
    const paymentData = req.body.paymentResult; // Get payment details from request

    const updatedOrder = await updateOrderPayment(id, paymentData);

    if (!updatedOrder[0]) {
      return responseHandler(res, updatedOrder[1], 404, false, '');
    }

    return responseHandler(
      res,
      'Payment updated successfully',
      200,
      true,
      updatedOrder[1]
    );
  } catch (error) {
    return responseHandler(res, error.message, 500, false, '');
  }
};

module.exports = { createOrder, getOrder, updateOrder };
