const {
  getAllTheProducts,
  saveProduct,
  getProductUsingId,
  deleteProductUsingId
} = require('../Services/productServices');
const { responseHandler } = require('../utils/responseHandler');
const { validateId, validateProduct } = require('../utils/validation');

const createProduct = async (req, res) => {
  try {
    const { details } = await validateProduct(req.body);

    if (details) {
      let allErrors = details.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }

    let savedProduct = await saveProduct(req.body);
    return savedProduct[0]
      ? responseHandler(
          res,
          'Product saved successfully',
          201,
          true,
          savedProduct[1]
        )
      : responseHandler(res, savedProduct[1], false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const getProduct = async (req, res) => {
  try {
    const { details: idErr } = await validateId(req.params);
    if (idErr) {
      let allErrors = idErr.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }

    const { id } = req.params;

    const checkId = await getProductUsingId(id);

    return checkId
      ? responseHandler(
          res,
          'Product retrieved successfully',
          200,
          true,
          checkId
        )
      : responseHandler(res, 'Error getting Product', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { details: idErr } = await validateId(req.params);
    if (idErr) {
      let allErrors = idErr.map(detail => detail.message.replace(/"/g, ''));
      return responseHandler(res, allErrors, 400, false, '');
    }

    const { id } = req.params;

    const checkId = await getProductUsingId(id);

    if (!checkId) {
      return responseHandler(res, 'Product not available', 400, false, '');
    }

    const check = await deleteProductUsingId(id);

    return check
      ? responseHandler(res, 'Product deleted successfully', 200, true, check)
      : responseHandler(res, 'Error deleting Product', 400, false, '');
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

const getAllProducts = async (req, res) => {
  try {
    responseHandler(
      res,
      'All Products retrieved successfully',
      200,
      true,
      await getAllTheProducts()
    );
  } catch (error) {
    return responseHandler(res, error.message, 400, false, '');
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProduct
};
