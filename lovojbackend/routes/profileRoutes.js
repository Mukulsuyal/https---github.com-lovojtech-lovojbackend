const express = require("express");
const { personalDetail, getPersonalDetails, updatepersonalDlt } = require("../controllers/profileController");
const { jwtAuth } = require("../middleware/jwtAuth");
const { upload } = require("../middleware/multer");
const personalDetRouter = express.Router();


personalDetRouter.post("/pdetails", jwtAuth, upload.fields([
  {
    name: "addressProof1",
    maxCount: 1,
  },
  {
    name: "addressProof2",
    maxCount: 1,
  },
  {
    name: "addressProof3",
    maxCount: 1,
  },
]), personalDetail);






personalDetRouter.put(
  "/update-pers",
  jwtAuth,
  upload.fields([
    {
      name: "addressProof1",
      maxCount: 1,
    },
    {
      name: "addressProof2",
      maxCount: 1,
    },
    {
      name: "addressProof3",
      maxCount: 1,
    },
  ]),
  updatepersonalDlt
);




personalDetRouter.get("/getpdetails", jwtAuth, getPersonalDetails);



module.exports = personalDetRouter;

