const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

const schema = mongoose.Schema({
  storeNumber: {
    type: String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  flag: {
    type: Boolean,
    // required: true,
    default: false,
  },
  storeType: {
    type: String,
    enum: ["Designer", "Fabric", "Factory", "Accessories"],
    required: true,
  },
  businessName: {
    type: String,
    // required: true,
  },
  businessAddress: {
    type: String,
  },
  visitingCardImage: {
    type: String,
  },
  idProofImage: {
    type: String,
  },
  businessProofImage: {
    type: String,
  },
});

module.exports = mongoose.model("stores", schema);
