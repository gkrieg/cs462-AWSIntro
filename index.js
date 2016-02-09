// setup Express
var express = require('express');
var path = require('path');
var cookie-parser = require('cookie-parser');

var portnum = 3000;
var app = express();
// start the server
var server = app.listen(portnum, function() {
console.log("Started on port 3000");
var host = server.address().address;
var port = server.address().port;
});
app.use(express.static(__dirname + '/public'));
