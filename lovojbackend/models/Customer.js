const mongoose = require('mongoose');
const userSchema = require('./user');

const customerSchema = new mongoose.Schema({
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    country: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  alternatePhoneNumber: {
    type: String
  },
  customerName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    type: String
  }
});

const productSchema = new mongoose.Schema({
    CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
      },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    productName: {
      type: String,
      required: true
    },
    fabricName: {
      type: String,
      required: true
    }
  });

const Product = mongoose.model('Product', productSchema);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
    Customer,
    Product
  };