const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    number: {
      type: Number,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    otp_key: {
      type: String,
      required: true,
    },
    used: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", tokenSchema);
