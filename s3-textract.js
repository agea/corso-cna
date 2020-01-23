exports.handler = async (event) => {

  const AWS = require('aws-sdk');
  const textract = new AWS.Textract();
  const s3 = new AWS.S3();

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(key + ' has been created');

  return new Promise((resolve, reject) => {
    var params = {
      Document: { /* required */
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      }
    };
    textract.detectDocumentText(params, function (err, data) {
      console.log({ err });
      console.log(JSON.stringify(data));
      const text = data.Blocks.map(block => block.Text).join('\n');

      s3.putObject({
        Body: text,
        Bucket: bucket,
        Key: key + '.txt'
      }, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve('ok');
        }

      });

    });

  });

};
