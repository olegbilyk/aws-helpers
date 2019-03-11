const AWS = require("aws-sdk");

const config = {
  folderName: process.argv[2],
  distributionId: "distributionId",
  cloudfrontOptions: {
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey"
  }
};

function invalidate({ distributionId, folderName, cloudfrontOptions = {} }) {
  if (folderName == null) {
    console.error("Empty folder name");
    return;
  }

  const cloudfront = new AWS.CloudFront(cloudfrontOptions);

  const params = {
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: [folderName === "all" ? "/*" : `/${folderName}/*`]
      }
    }
  };

  cloudfront.createInvalidation(params, function(error) {
    if (error) {
      console.error(error, error.stack);
    } else {
      console.log(`Successful invalidate ${folderName}`);
    }
  });
}

invalidate(config);

module.exports = invalidate;
