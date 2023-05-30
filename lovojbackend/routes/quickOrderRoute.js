const express = require("express");
const {jwtAuth }= require("../middleware/jwtAuth");
const { upload } = require("../middleware/multer");
const quickOrderRouter = express.Router();
const { getCustomers, getCustomerById, createProduct, createCustomer, getProductByCustomerId} = require("../controllers/QuickOrderController")


quickOrderRouter.post("/order/customer", jwtAuth, createCustomer);
quickOrderRouter.get("/order/customer", jwtAuth, getCustomers);
quickOrderRouter.get("/order/customer/:id", jwtAuth, getCustomerById);
quickOrderRouter.post("/order/customer/product", jwtAuth, createProduct);
quickOrderRouter.get("/order/customer/product/:id", jwtAuth, getProductByCustomerId);

module.exports = quickOrderRouter;