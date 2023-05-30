const mongoose = require("mongoose");
let schema = new mongoose.Schema({
  fabNumber: { type: String, unique: true },
  fabName: { type: String, required: [true, 'Fabric name is required'] },
  fabImage: { type: String, required: [true, 'Fabric image is required'] },
  tilex: { type: Number },
  tiley: { type: Number },
  glossy: { type: Boolean },
  storeNumber: { type: String, required: [true, 'Store number is required'] },
  mobileNumber: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: 'Mobile number should be a 10-digit number',
    },
  },
  fabricSupplierContract: { type: String },
  fabricCategory: { type: Array },
  fabricBrand: { type: Array },
  fabricColor: { type: Array },
  fabricQuantity: { type: [Number], default: [] },
  fabricDiscount: { type: Array },
  fabricComposition: { type: Array },
  fabricSubCategory: { type: Array },
  fabricMaterial: { type: Array },
  fabricPattern: { type: Array },
  fabricType: { type: Array },
  fabricCharacteristics: { type: Array },
  fabricSeason: { type: Array },
  totalPrice: { type: Number, default: 0 },
  createdBy: { type: String },
  createdDate: { type: Date, default: Date.now },
});


// Generate a random 6-digit string for the fabNumber field
schema.pre("save", function (next) {
  const fabric = this;
  if (!fabric.fabNumber) {
    fabric.fabNumber = Math.floor(100000 + Math.random() * 900000).toString();
  }
  next();
});

module.exports = mongoose.model("Fabrics", schema);
