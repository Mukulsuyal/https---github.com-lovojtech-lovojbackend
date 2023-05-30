const express = require("express");
const adminrouter = express.Router();
const { superadminSignUp } = require("../controllers/authController");

// //**********************Super admin Sign up *********************************/
adminrouter.post("/mainAdmin", superadminSignUp);

module.exports=adminrouter;
