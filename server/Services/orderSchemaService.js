const OrderItem = require('../model/OrderItems');

const getOrderById = async id => await OrderItem.findById(id);

module.exports = { getOrderById };
