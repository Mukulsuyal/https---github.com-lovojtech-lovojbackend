const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("mongoose-type-email");

let schema = mongoose.Schema({
  storeId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
  otp: String,
  otpSentAt: Date,
  storeNumber: {
    type: String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    // required: [true, "email must have"],
  },
  password: {
    type: String,
    required: true,
  },
  // token: {
  //   type: String,
  //   default: "",
  // },
  mobileNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  storeType: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      "admin",
      "manager",
      "sales",
      "cutter",
      "tailor",
      "stitching",
      "QC",
      "delivery",
    ],
    required: true,
  },
  address: String,
  addressProof: {
    type: Object,
  },
  whatsapp: String,
  telegram: String,
  line: String,
  signature: String,
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});
// Password hashing
schema.pre("save", function (next) {
  let user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});
// Password verification upon login
schema.methods.login = function (password) {
  let user = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

module.exports = mongoose.model("user", schema);
