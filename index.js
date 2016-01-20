// setup Express
var express = require('express');
var path = require('path');

var portnum = 3000;
var app = express();
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
  var params = req.params;
  var together  = headers + body + params;
    res.send(JSON.stringify(together));
});
