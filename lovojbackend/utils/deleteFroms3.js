const path = require('path');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,                    
  region: process.env.AWS_REGION,
  Bucket:process.env.S3_BUCKET_NAME,
  BucketUrl:process.env.BUCKET_BASE_URL
});

const deleteFromS3 = async (imageUrl) => {
  try {
    const key = imageUrl.replace(process.env.BUCKET_BASE_URL, '');
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };
    const deletedFromS3 = await s3.deleteObject(params).promise();
    // console.log('Deleted from S3:', deletedFromS3);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};


  module.exports=deleteFromS3;