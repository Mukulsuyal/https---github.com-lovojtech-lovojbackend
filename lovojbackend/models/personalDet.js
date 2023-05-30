const mongoose = require('mongoose');
const userSchema = require('./user');

const PersonalDetails = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
 
  whatsapp: {
    type: String,
    // required: true,
    unique: true
  },
  telegram: {
    type: String,
    // required: true,
    unique: true
  },
  // linkedin: {
  //   type: String,
  //   required: true,
  //   unique: true
  // },
  addressProof1: {
    type: String,
    required: true
  },
  addressProof2: {
    type: String,
    // required: true
  },
  addressProof3: {
    type: String,
    // required: true
  }
});

module.exports = mongoose.model('PersonalDet', PersonalDetails);

