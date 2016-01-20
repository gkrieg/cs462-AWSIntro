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
app.static.mime.define({"text/html": ["byu"]});
})
