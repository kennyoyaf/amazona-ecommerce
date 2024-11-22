const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      required: [true, 'Role is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
