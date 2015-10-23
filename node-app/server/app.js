var proxy = require('express-http-proxy');
var express = require('express');
var app = express();

app.use('/zillow-proxy', proxy('www.zillow.com', {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

app.use('/', express.static(__dirname + '/../app'));
app.use('/app', express.static(__dirname + '/../app'));

var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});