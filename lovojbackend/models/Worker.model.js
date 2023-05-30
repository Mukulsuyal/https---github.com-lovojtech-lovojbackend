const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Workers Collection
const workersSchema = new mongoose.Schema({
  storeNumber: {
    type: String,
    required: true
  },
  storeType: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['manager', 'sales', 'cutter', 'accessories', 'QC', 'Delivery']
  },
  password: {
    type: String,
    required: true
  }
});


// Password hashing
workersSchema.pre("save", function (next) {
  let worker = this;

  // if the data is not modified
  if (!worker.isModified("password")) {
    return next();
  }

  bcrypt.hash(worker.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    worker.password = hash;
    next();
  });
});
// Password verification upon login
workersSchema.methods.login = function (password) {
  let worker = this;

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, worker.password, (err, result) => {
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

const Workers = mongoose.model('Workers', workersSchema);

module.exports = { Workers };
