var xml2js = require('xml2js');
const https = require('https');

const url = "https://medium.com/feed/@arizeai";
const RESULT_SIZE = 3;

var parser = new xml2js.Parser();



https.get(url, (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {

    parser.parseString(data, function (err, result) {
      var items = formatItems(result.rss.channel[0].item);
        console.log(items);
    });

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

function formatItems(items){
  var listSize = Math.min(items.length,RESULT_SIZE);
  var outputHTML = '';
//console.log(items);
  for (var i = 0; i < listSize; i++) {

      outputHTML += '<ul><a href="'+items[i].link[0]+'">'+items[i].title[0]+'</a></ul>';
  }

  return outputHTML;
}
