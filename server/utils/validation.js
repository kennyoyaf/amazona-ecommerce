const Joi = require('joi');

const validateProduct = async body => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      slug: Joi.string().required(),
      category: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required(),
      brand: Joi.string().required(),
      rating: Joi.number().required(),
      numReviews: Joi.number().required(),
      countInStock: Joi.number().required(),
      description: Joi.string().required()
    });
    return await schema.validateAsync(body, { abortEarly: false });
  } catch (error) {
    return error;
  }
};

const validateId = async field => {
  const schema = Joi.object({
    id: Joi.string().required().length(24)
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (error) {
    return error;
  }
};

//client creation validation rules
const clientSignupValidation = async field => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().trim(true).required(),
    lastName: Joi.string().alphanum().trim(true).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).trim(true).required(),
    role: {
      type: String,
      enum: ['admin', 'client'],
      required: true,
      default: 'client' // Default role is client
    }
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//client login validation rules
const clientLoginValidation = async field => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).trim(true).required()
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//admin creation validation rules
const adminSignupValidation = async field => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().trim(true).required(),
    lastName: Joi.string().alphanum().trim(true).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).trim(true).required(),
    role: {
      type: String,
      enum: ['admin', 'client'],
      required: true,
      default: 'client' // Default role is client
    }
  });

  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

//admin login validation rules
const adminLoginValidation = async field => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).trim(true).required()
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

const orderValidation = async field => {
  const schema = Joi.object({
    orderItems: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().messages({
            'string.base': 'Item name must be a string.',
            'any.required': 'Item name is required.'
          }),
          quantity: Joi.number().integer().positive().required().messages({
            'number.base': 'Item quantity must be a number.',
            'number.positive': 'Item quantity must be greater than zero.',
            'any.required': 'Item quantity is required.'
          }),
          image: Joi.string().uri().required().messages({
            'string.base': 'Item image must be a string.',
            'string.uri': 'Item image must be a valid URL.',
            'any.required': 'Item image is required.'
          }),
          price: Joi.number().positive().required().messages({
            'number.base': 'Item price must be a number.',
            'number.positive': 'Item price must be greater than zero.',
            'any.required': 'Item price is required.'
          })
        })
      )
      .min(1)
      .required()
      .messages({
        'array.base': 'Order items must be an array.',
        'array.min': 'Order must contain at least one item.',
        'any.required': 'Order items are required.'
      }),
    shippingAddress: Joi.object({
      fullName: Joi.string().required().messages({
        'string.base': 'Full name must be a string.',
        'any.required': 'Full name is required.'
      }),
      address: Joi.string().required().messages({
        'string.base': 'Address must be a string.',
        'any.required': 'Address is required.'
      }),
      city: Joi.string().required().messages({
        'string.base': 'City must be a string.',
        'any.required': 'City is required.'
      }),
      postalCode: Joi.string().required().messages({
        'string.base': 'Postal code must be a string.',
        'any.required': 'Postal code is required.'
      }),
      country: Joi.string().required().messages({
        'string.base': 'Country must be a string.',
        'any.required': 'Country is required.'
      })
    }).required(),
    paymentMethod: Joi.string().required().messages({
      'string.base': 'Payment method must be a string.',
      'any.required': 'Payment method is required.'
    }),
    itemsPrice: Joi.number().positive().required().messages({
      'number.base': 'Items price must be a number.',
      'number.positive': 'Items price must be greater than zero.',
      'any.required': 'Items price is required.'
    }),
    shippingPrice: Joi.number().positive().required().messages({
      'number.base': 'Shipping price must be a number.',
      'number.positive': 'Shipping price must be greater than zero.',
      'any.required': 'Shipping price is required.'
    }),
    taxPrice: Joi.number().positive().required().messages({
      'number.base': 'Tax price must be a number.',
      'number.positive': 'Tax price must be greater than zero.',
      'any.required': 'Tax price is required.'
    }),
    totalPrice: Joi.number().positive().required().messages({
      'number.base': 'Total price must be a number.',
      'number.positive': 'Total price must be greater than zero.',
      'any.required': 'Total price is required.'
    }),
    isPaid: Joi.boolean().default(false).required().messages({
      'boolean.base': 'IsPaid must be a boolean value.',
      'any.required': 'IsPaid is required.'
    }),
    isDelivered: Joi.boolean().default(false).required().messages({
      'boolean.base': 'IsDelivered must be a boolean value.',
      'any.required': 'IsDelivered is required.'
    }),
    paidAt: Joi.date().optional().allow(null).messages({
      'date.base': 'PaidAt must be a valid date.'
    }),
    deliveredAt: Joi.date().optional().allow(null).messages({
      'date.base': 'DeliveredAt must be a valid date.'
    })
  });
  try {
    return await schema.validateAsync(field, { abortEarly: false });
  } catch (err) {
    return err;
  }
};

module.exports = {
  clientLoginValidation,
  clientSignupValidation,
  adminLoginValidation,
  adminSignupValidation,
  validateProduct,
  validateId,
  orderValidation
};
