var util = require('util');
var twitter = require('twitter');
var twit = new twitter(require('./init.config').getKeys());
var fs = require('fs');
var app = require('http').createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(fs.readFileSync('index.html'));
}).listen(3000);


var io = require('socket.io').listen(app);
streamFlg = true;

io.sockets.on('connection', function(socket) {
  var stream;
  
  socket.on('msg', function(data) {
    streamFlg = true;
    var keyword = data;
    var option = {'track': keyword, 'include_entities': 'true'};
    //var option = {'track': keyword, 'language': 'ja', 'include_entities': 'true'};
    
    console.log(keyword + 'を含むツイートを取得します。');
    
    var stream = function(stream) {
      console.log("streamFlg="+streamFlg);
      stream.on('data', function (data) {
        if (streamFlg) {
          io.sockets.emit('data', data);
          console.log(data);
        }
      });
    };
    twit.stream('statuses/filter', option, stream);
  });

  socket.on('stop', function(data) {
    streamFlg = false;
  });

});