exports.index = function(req, res) {

    io.sockets.on('connection', function(socket) {

        socket.on('msg', function(data) {
            var keyword = data;
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
                stream.on('data', function(data) {
                    io.sockets.emit('data', data);
                    console.log(data);
                });
            };

            if (!keyword) {
                twit.stream('statuses/sample', stream);
            } else {
                twit.stream('statuses/filter', option, stream);
            }

        });

    });
}