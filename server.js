var util = require('util');
var twitter = require('twitter');
var twit = new twitter(require('./init.config').getKeys());
var fs = require('fs');
var app = require('http').createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fs.readFileSync('index.html'));

}).listen(3000);


var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {

  socket.on('msg', function(data) {
    var keyword = data;
    var option = {'track': keyword, 'language': 'ja', 'include_entities': 'true'};
    console.log(keyword+'を含むツイートを取得しま〜す♪');
    twit.stream('statuses/filter', option, function(stream) {
      stream.on('data', function (data) {
        io.sockets.emit('data', data);
        console.log(data);
      });
    });
  });
  socket.on('stop', function(data) {
    io.app.end();
  });

});
