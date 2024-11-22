const Product = require('../model/Product');

const saveProduct = async body => {
  try {
    const theProduct = new Product(body);
    return (await theProduct.save())
      ? [true, theProduct]
      : [false, 'Error saving Product'];
  } catch (error) {
    return [false, error];
  }
};

const getProductUsingId = async id => await Product.findById(id);

const deleteProductUsingId = async id => await Product.findByIdAndDelete(id);

const getAllTheProducts = async () => await Product.find();

module.exports = {
  getProductUsingId,
  getAllTheProducts,
  saveProduct,
  deleteProductUsingId
};
