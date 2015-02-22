var app = require('../../app');
var http = require('http').Server(app);
var util = require('util');
var twitter = require('twit');
var twit = new twitter(require('../../init.config').getKeys());
var fs = require('fs');
var io = require('socket.io').listen(server);

function skio() {

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
            stopObject(sampleStream);
            stopObject(filterStream);
        }

        function stopObject(obj) {
            if (typeof obj !== "undefined") {
                obj.stop();
                obj.flg = false;
            }
        }
    });
}

module.exports = skio;