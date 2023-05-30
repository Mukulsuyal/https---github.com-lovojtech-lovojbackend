const AWS = require('aws-sdk');
const uploadToS3 = require('../utils/s3Upload');

exports.testing = async (req, res) => {
    try {
        //  console.log("filedataaaa",req.files.data);
        // const fileUrl = await uploadToS3(req.files);
        const fileObj = req.files.file[0];
        const addressObj = req.files.address[0];
        console.log("ffff",fileObj)
        const fileUrl = await uploadToS3 (fileObj);
        const addressUrl = await uploadToS3(addressObj);
 res.json({ fileUrl: fileUrl, addressUrl:addressUrl});
    // res.send(`File uploaded successfully. URL: ${fileUrl}`);
    } catch (error) {
        console.error("error",error);
        res.status(500).send('An error occurred while uploading the file.');
}


}