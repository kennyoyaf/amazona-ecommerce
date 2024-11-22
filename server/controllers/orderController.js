const { saveOrder, getUserUsingId } = require('../Services/orderService');
const { responseHandler } = require('../utils/responseHandler');
const { orderValidation } = require('../utils/validation');

const createOrder = async (req, res) => {
  try {
    const { details } = await orderValidation(req.body);

    if (details) {
      const validationErrors = details.map(detail =>
        detail.message.replace(/"/g, '')
      );
      return responseHandler(res, validationErrors, 400, false, '');
    }

    // Get the buyer's ID from req.user
    const buyerId = req.user.id;

    // Attach the buyer's ID to the order
    const orderData = { ...req.body, user: buyerId };

    const savedOrder = await saveOrder(orderData);
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

module.exports = { createOrder };
