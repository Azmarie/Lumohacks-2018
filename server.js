var express = require('express');
var app = express();

var options = {
  index: "index.html"
};
var port = process.env.PORT || 9999;
app.use('/', express.static(__dirname + '/assets', options));
app.listen(port, function() { console.log('meow listening')});
