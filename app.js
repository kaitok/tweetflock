var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var less = require('less-middleware');
var bootstrapPath = path.join(__dirname, 'node_modules', 'twitter-bootstrap-3.0.0');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// less setting 
app.use(less(path.join(__dirname, 'assets', 'less'),
 { dest: path.join(__dirname, 'public'),
 preprocess: {
   path: function(pathname, req) {
     return pathname.replace('/stylesheets', '');
   }
 }
},
{ paths:  [path.join(bootstrapPath, 'less')] }
));

app.get('/', function (req, res) {
  res.render('home', function(err, html){

  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var util = require('util');
var twitter = require('twitter');
var twit = new twitter(require('./init.config').getKeys());
var fs = require('fs');
var io = require('socket.io').listen(server);
streamFlg = true;

io.sockets.on('connection', function(socket) {
  var stream;
  
  socket.on('msg', function(data) {
    streamFlg = true;
    var keyword = data;
    var image_url = "";
    var option = {'track': keyword};
    if(!keyword){
      return; 
    }
    console.log(keyword + 'を含むツイートを取得します。');
    var stream = function(stream) {
      stream.on('data', function (data) {
        if (streamFlg) {
          io.sockets.emit('data', data,image_url);
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


module.exports = app;
