const express = require("express");
const superAdminRouter = express.Router();
const { jwtAuth, authorizeAdmin } = require("../middleware/jwtAuth");
const { getStoreState, verifyStore } = require("../controllers/superAdminController");

// //**********************Super admin Sign up *********************************/

superAdminRouter.get('/superadmin/stores',jwtAuth,authorizeAdmin,getStoreState)
superAdminRouter.put("/superadmin/stores/:id", jwtAuth, authorizeAdmin, verifyStore);

module.exports = superAdminRouter;