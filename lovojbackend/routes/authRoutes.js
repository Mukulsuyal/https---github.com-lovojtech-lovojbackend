const express = require("express");
const { jwtAuth, generateToken } = require("../middleware/jwtAuth");
const { upload } = require("../middleware/multer");
const {
  checkemail,
  signUp,
  logIn,
  deleteStore,
  resetPassword,
  forgetPassword,
  forgotPassword,
  resetPasswordd,
  resendOTP,
  getAllStores,
  getStoreByTypeAndNumber,
  superadminController,
  updateStatus,
} = require("../controllers/authController");
const router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const authKeys = require("../middleware/authKeys");

router.use(bodyParser.json());

// endpoint for sending OTP to user's email
router.post("/forgot-password", forgotPassword);

// endpoint for resetting password with OTP validation
router.post("/reset-passwordd", resetPasswordd);

router.post("/resendOTP", resendOTP);

router.post("/checkemail", checkemail);
//**********************************SignUp*******************************************************
router.post("/createStore",upload.none(), signUp);

router.get("/stores/:storeType?", getAllStores);

router.get("/stores/:storeType/:storeNumber", getStoreByTypeAndNumber);

//////////////////////////////////////*********************////////////////////////////////
router.delete("/store/:storeNumber", deleteStore);

//******************************************Login*********************************************
router.post("/login", logIn);

// router.put("/store", updateStatus);

// router.put("/storeupdate", updateStore);

// router.post("/superAdmin", superadminController);

// router.post("/superadmin", superadminController);

// router.post("/forgot-password", forgetPassword);

// router.get("/reset-password", resetPassword);

module.exports = router;
