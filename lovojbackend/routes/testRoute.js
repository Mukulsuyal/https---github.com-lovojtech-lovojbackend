
const express = require("express");
const { testing } = require("../controllers/testController");
const { upload } = require("../middleware/multer");
const testrouter = express.Router();

// testrouter.post("/test",upload.single('file') ,testing);


testrouter.post("/test",
upload.fields([
    {
        name:"file",
        maxCount:1,
    },
    {
        name: "address",
        maxCount:1,
    },
]),
testing
);

module.exports=testrouter;