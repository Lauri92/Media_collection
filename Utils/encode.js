'use strict';

require('dotenv').config();
const aws = require('aws-sdk');
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new aws.S3({apiVersion: '2006-03-01'});

// Get image from S3
const getImage = async (key) => {
  return s3.getObject(
      {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      },
  ).promise();
};

// Encode the data to base64
const encode = async (data) => {
  let buf = Buffer.from(data);
  return buf.toString('base64');
};

module.exports = {
  getImage,
  encode
}