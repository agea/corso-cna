const AWS = require('aws-sdk');

const cloudwatchlogs = new AWS.CloudWatchLogs({ region: 'eu-west-3' });
const cloudwatch = new AWS.CloudWatch({ region: 'eu-west-3' });

const params = {
  logGroupName: 'access_log', /* required */
  logStreamName: 'i-009a60100a060662f', /* required */
  endTime: new Date().getTime(),
  startFromHead: false,
  startTime: new Date().getTime() - 60 * 60 * 1000
}

cloudwatchlogs.getLogEvents(params, function (err, data) {
  if (err) {
    console.log(err, err.stack);
  }
  else {
    const requestsPerHour = data.events.length;
    cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'requests_per_hour',
          Unit: 'Count',
          Value: requestsPerHour
        },
      ],
      Namespace: 'CNA'
    }, function (err, data) {
      console.log({ err });
      console.log({ data });
    })

  }
});