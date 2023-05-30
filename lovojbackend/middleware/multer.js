const multer = require('multer');
const path = require('path');
//test
const fileStorage = multer.memoryStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'file') {
      cb(null, './images/file/');
    } else if (file.fieldname === 'addressProof1' || file.fieldname === 'addressProof2' || file.fieldname === 'addressProof3') {
      cb(null, './images/address/');
    } else if (file.fieldname === 'fabImage') {
      cb(null, './images/fabImage/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 5242880 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== 'file' && file.fieldname !== 'addressProof1' && file.fieldname !== 'addressProof2' && file.fieldname !== 'addressProof3' && file.fieldname !== 'fabImage') {
      cb(new Error('Invalid field name'));
    } else if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('Please upload an image.'));
    } else {
      cb(null, true);
    }
  }
});

module.exports = { upload };


