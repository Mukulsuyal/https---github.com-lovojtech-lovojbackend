const express = require("express");
const {
  addFabric,
  getFabric,
  updateFabric,
  deleteFabric,
  getFab,
  getFabricByStoreNumber,
  getFabricByStoreAndNumber,
  addToCart,
  getCartTotal,
} = require("../controllers/fabricController");
const { jwtAuth, generateToken } = require("../middleware/jwtAuth");
const { upload } = require("../middleware/multer");
const Fabrics = require("../models/fabric");
const router = express.Router();

/***************** URL : {{LOCAL_URL}}/fabric/addFabric ***************/
router.post("/addFabric", jwtAuth, upload.single("fabImage"), addFabric);

/***************** URL : {{LOCAL_URL}}/fabric/getfabric ***************/
router.get("/getfabric", jwtAuth, getFabric);

/***************** URL : {{LOCAL_URL}}/fabric/getfabrics/D100 ***************/
router.get("/getfabrics/:storeNumber", jwtAuth, getFabricByStoreNumber);

/***************** URL : {{LOCAL_URL}}/fabric/D100/100007 ***************/
router.get("/:storeNumber/:fabNumber", jwtAuth, getFabricByStoreAndNumber);

/***************** URL : {{LOCAL_URL}}/fabric/getfabric/:id ***************/
router.get("/getfabric/:id", jwtAuth, getFab);

/***************** URL : {{LOCAL_URL}}/fabric/updatefab/:id ***************/
router.put("/updatefab/:id", jwtAuth, upload.single("fabImage"), updateFabric);

/***************** URL : {{LOCAL_URL}}/fabric/deletefab/:id ***************/
router.delete("/deletefab/:id", jwtAuth, deleteFabric);

// Add fabric to cart
router.post("/cart", jwtAuth, addToCart);
// router.get("/cart/total", jwtAuth, getCartTotal);
router.get("/cart/:userId/total", getCartTotal);

//   // Create a route to generate a random dash number
//   router.get('/generate-dash-number', async (req, res) => {
//     try {
//       const fabric = new Fabrics({ givenNumber: 1234 });
//       await fabric.save();
//       res.send({ dashNumber: fabric.dashNumber });
//     } catch (err) {
//         console.log(err);
//       res.status(500).send({ error: 'Failed to generate dash number' });
//     }
//   });

// router.post("/changePass",jwtAuth, changePassword);


module.exports = router;
