// setup Express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');



var portnum = 3000;
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// start the server
var server = app.listen(portnum, function() {
console.log("Started on port 3000");
var host = server.address().address;
var port = server.address().port;
});
app.use(express.static(__dirname + '/public'));
express.static.mime.define({"text/html": ["byu"]});

app.post('/headers', function(req, res) {
  var headers = req.headers;
  var body = req.body;
  var params = JSON.stringify(req.params);
  var together  = JSON.stringify(headers) + "\n" + JSON.stringify(body) + "\n" + params;
    res.send(together);
});
