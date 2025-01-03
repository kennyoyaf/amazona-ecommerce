const { saveOrderItem } = require('../Services/orderItemService');
const { responseHandler } = require('../utils/responseHandler');
const { validateOrderItems } = require('../utils/validation');

const createOrderItem = async (req, res) => {
  try {
    const { details } = await validateOrderItems(req.body);

    if (details) {
      const validationErrors = details.map(detail =>
        detail.message.replace(/"/g, '')
      );
      return responseHandler(res, validationErrors, 400, false, '');
    }

    console.log(req.body);
    console.log(req.id);

    const { orderItems, ...item } = req.body;

    console.log({ orderItems, item });

    // Get the buyer's ID from req.user
    const orderId = req.id;

    // Attach the buyer's ID to the order
    const orderData = { ...item, order: orderId };

    const savedOrder = await saveOrderItem(orderData);

    console.log(savedOrder);

    if (!savedOrder[0]) return responseHandler(res, savedOrder[1], false, '');

    return savedOrder[0]
      ? responseHandler(
          res,
          'Order item created successfully',
          201,
          true,
          savedOrder[1]
        )
      : responseHandler(res, savedOrder[1], false, '');
  } catch (error) {
    return responseHandler(res, error.message, 500, false, '');
  }
};

module.exports = { createOrderItem };
