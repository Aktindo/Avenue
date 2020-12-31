module.exports = (client) => {
    var https = require('https');
    require('dotenv').config()
     
    // The following 4 are the actual values that pertain to your account and this specific metric.
    var apiKey = process.env.SYSTEM_METRIC_APIKEY;
    var pageId = process.env.SYSTEM_METRIC_PAGEID;
    var metricId = process.env.SYSTEM_METRIC_METRICID;
    var apiBase = 'https://api.statuspage.io/v1';
     
    var url = apiBase + '/pages/' + pageId + '/metrics/' + metricId + '/data.json';
    var authHeader = { 'Authorization': 'OAuth ' + apiKey };
    var options = { method: 'POST', headers: authHeader };
     
    // Need at least 1 data point for every 5 minutes.
    // Submit random data for the whole day.
    var totalPoints = 60 / 5 * 24;
    var epochInSeconds = Math.floor(new Date() / 1000);
     
    // This function gets called every second.
    function submit(count) {
      count = count + 1;
     
      if(count > totalPoints) return;
     
      var currentTimestamp = epochInSeconds - (count - 1) * 5 * 60;
      var latency = Math.floor(client.ws.ping)
     
      var data = {
        timestamp: currentTimestamp,
        value: latency,
      };
     
      var request = https.request(url, options, function (res) {
        if (res.statusMessage === "Unauthorized") {
          const genericError =
            "Error encountered. Please ensure that your page code and authorization key are correct.";
          return console.error(genericError);
        }
        res.on("data", function () {
          console.log("Ignore this > Submitted point " + count + " of " + totalPoints);
        });
        res.on("end", function () {
          setTimeout(function () {
            submit(count);
          }, 1000);
        });
        res.on("error", (error) => {
          console.error(`Error caught: ${error.message}`);
        });
      });
     
      request.end(JSON.stringify({ data: data }));
    }
     
    submit(0);
}