const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,                    
  region: process.env.AWS_REGION,
  Bucket:process.env.S3_BUCKET_NAME,
  BucketUrl:process.env.BUCKET_BASE_URL
});

const uploadToS3 = async (file) => {
  try {
    const ext = path.extname(file.originalname.toString());
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: null,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    let keyName;

    if (
      file.fieldname === "addressProof1" ||
      file.fieldname === "addressProof2" ||
      file.fieldname === "addressProof3"
    ) {
      keyName = `uploads/addressFiles/${Date.now()}${ext}`;
  }

    if (file.fieldname === "fabImage") {
      keyName = `uploads/fabImage/${Date.now()}${ext}`
    }
    if (file.fieldname === "file") {
      keyName = `uploads/file/${Date.now()}${ext}`
    }
    if (file.fieldname === "address") {
      keyName = `uploads/address/${Date.now()}${ext}`
    }
    params.Key = keyName;
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    throw error;
  }
};

const deleteFromS3 = async (imageUrl) => {
  try {
    const key = imageUrl.replace(process.env.BUCKET_BASE_URL, '');
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    await s3.deleteObject(params).promise();
  } catch (error) {
    throw error;
  }
};
module.exports=uploadToS3;