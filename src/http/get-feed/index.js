var xml2js = require('xml2js');
const https = require('https');

const url = "https://medium.com/feed/@arizeai";
const RESULT_SIZE = 3;




let body_template = `
<!doctype html>
<html lang=en>
  <body>#CONTENT</body>
</html>
`

function doRequest(url) {
  return new Promise ((resolve, reject) => {

    https.get(url, (resp) => {
      let data = '';
      //console.log(url);
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
        //console.log("chunk");
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        var parser = new xml2js.Parser();
        //console.log(data);
        parser.parseString(data, function (err, result) {
          //console.log(result);
          var items = formatItems(result.rss.channel[0].item);
          //console.log(items);
          resolve(items);
        });

      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err);
    });




  });
}


exports.handler = async function http (request) {
  let res = await doRequest(url);
  //console.log("test2");
  //console.log(res);
  var body = body_template.replace("#CONTENT", res);
  console.log(body);
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf8' },
    body
  }

}


function formatItems(items){
  var listSize = Math.min(items.length,RESULT_SIZE);
  var outputHTML = '';
//console.log(items);
  for (var i = 0; i < listSize; i++) {

      outputHTML += '<ul><a href="'+items[i].link[0]+'">'+items[i].title[0]+'</a></ul>';
  }

  return outputHTML;
}
