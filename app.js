var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var less = require('less-middleware');
var bootstrapPath = path.join(__dirname, 'node_modules', 'twitter-bootstrap-3.0.0');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
app.use(less(path.join(__dirname, 'assets', 'less'), {
    dest: path.join(__dirname, 'public'),
    preprocess: {
        path: function(pathname, req) {
            return pathname.replace('/stylesheets', '');
        }
    }
}, {
    paths: [path.join(bootstrapPath, 'less')]
}));

app.get('/', function(req, res) {
    res.render('home', function(err, html) {

    });
});

var server = app.listen(3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

var util = require('util');
var twitter = require('twit');
var twit = new twitter(require('./init.config').getKeys());
var fs = require('fs');
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {

    var stream;
    var sampleStream;
    var filterStream;
    var keyword;

    socket.on('msg', function(keyword) {

        if (!keyword) {
            if (checkSubmit(sampleStream)) return;
        } else {
            if (checkSubmit(filterStream)) return;
        }

        var image_url = "";
        var option = {
            'track': keyword
        };

        if (!keyword) {
            console.log('Search all key word');
        } else {
            console.log(keyword + 'を含むツイートを取得します。');
        }

        var stream = function(stream) {
            console.log(stream);
            io.sockets.emit('data', stream);
        };

        if (!keyword) {
            sampleStream = twit.stream('statuses/sample');
            sampleStream.on('tweet', stream);
            sampleStream.flg = true;
        } else {
            filterStream = twit.stream('statuses/filter', option);
            filterStream.on('tweet', stream);
            filterStream.flg = true;
        }
    });

    function checkSubmit(streamObj) {
        if (typeof streamObj !== "undefined" && streamObj.flg) {
            return true;
        } else {
            return false;
        }
    }

    socket.on('stop', function() {
        serverStop();
    });

    socket.on('disconnect', function() {
        serverStop();
    });

    function serverStop() {
        stopStream(sampleStream);
        stopStream(filterStream);
    }

    function stopStream(obj) {
        if (typeof obj !== "undefined") {
            obj.stop();
            obj.flg = false;
        }
    }
});


module.exports = app;