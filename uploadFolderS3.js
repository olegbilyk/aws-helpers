const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const folderName = process.argv[2];
const config = {
  bucketName: "bucketName",
  folderName,
  folderPath: `./${folderName}`,
  s3Options: {
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey"
  }
};

function walkSync(folderPath, currentDirPath, callback) {
  fs.readdirSync(path.join(__dirname, currentDirPath)).forEach(function(
    fileName
  ) {
    const filePath = path.join(__dirname, currentDirPath, fileName);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      callback(filePath, fileName);
    } else if (stat.isDirectory()) {
      walkSync(folderPath, currentDirPath + "/" + fileName, callback);
    }
  });
}

function uploadFolderS3({ bucketName, folderName, folderPath, s3Options = {} }) {
  if (folderName == null) {
    console.error("Empty folder name");
    return;
  }

  const s3 = new AWS.S3(s3Options);
  const rootFolder = path.join(__dirname, folderPath);

  walkSync(bucketName, folderPath, function(filePath, fileName) {
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${filePath.substring(rootFolder.length + 1)}`,
      Body: fs.readFileSync(filePath),
      ACL: "public-read"
    };

    s3.putObject(params, function(error) {
      if (error) {
        console.error(error);
      } else {
        console.log("Successfully uploaded " + fileName + " to " + bucketName);
      }
    });
  });
}

uploadFolderS3(config);

module.exports = uploadFolderS3;
