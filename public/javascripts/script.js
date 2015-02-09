  $(function() {

      var socket = io.connect();

      $('form').submit(function() {
          socket.emit('msg', $('input').val());
          return false;
      });

      $('#stop').click(function() {
          socket.emit('stop');
          return false;
      });

      //response取得
      socket.on('data', function(data, flg) {
          if (flg) {
              return;
          }
          if (data !== null && data.geo != undefined && data.geo['coordinates'] !== null) {
              var geo = data.geo['coordinates'];
              var latitude = geo[0]; //緯度
              var longitude = geo[1]; //経度
              setMapping(latitude, longitude, data);
          }
      });

      //位置情報の取得
      navigator.geolocation.getCurrentPosition(function(pos) {
          createMap(pos.coords.latitude, pos.coords.longitude, 5);
      }, function(err) {
          createMap('24.37', '160.76', 2);
      });


      //mapの設定
      function createMap(latitude, longitude, zoom) {
          var myLatlng = new google.maps.LatLng(latitude, longitude);
          var myOptions = {
              zoom: zoom,
              center: myLatlng,
              zoomControl: false,
              streetViewControlOptions: {
                  position: google.maps.ControlPosition.LEFT_BOTTOM
              },
              scaleControl: true,
              mapTypeControl: true,
              mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.DEFAULT,
                  position: google.maps.ControlPosition.BOTTOM_LEFT
              },
              mapTypeId: google.maps.MapTypeId.HYBRID
          };
          var canvas = $('#map_canvas')[0];
          map = new google.maps.Map(canvas, myOptions);
      }

  });

  var map;

  function setMapping(latitude, longitude, data) {

      var myLatlng = new google.maps.LatLng(latitude, longitude); //経度,緯度
      var marker = new google.maps.Marker({
          position: myLatlng,
          animation: google.maps.Animation.DROP
      });

      marker.setMap(map);

      var contentTweet = {};
      contentTweet.body = '<div class="media tweet_window"><div class="media-body"><a href="http://twitter.com/' + data.user['screen_name'] + '" target="_blank"><img class="media-object" src="' + data.user['profile_image_url'] + '" target="_blank"></a><p class="media-heading">' + data.text + '</p></div></div>';

      $('#tweet_box').prepend(contentTweet.body);

      var infowindow = new google.maps.InfoWindow({
          content: contentTweet.body,
          disableAutoPan: false
      });

      $('.tweet_window')[0].onclick = function() {
          google.maps.event.trigger(marker, 'sidebarclick');
      };

      google.maps.event.addListener(marker, 'sidebarclick', function() {

          if (isInfoWindowOpen(infowindow)) {
              infowindow.close(map, marker);
          } else {
              if (map.zoom <= 18) {
                  map.setZoom(18);
                  map.setCenter(marker.getPosition());
              }
              infowindow.open(map, marker);
          }

          function isInfoWindowOpen(infoWindow) {
              var map = infoWindow.getMap();
              return (map !== null && typeof map !== "undefined");
          }
      });

      google.maps.event.addListener(marker, 'click', function() {

          if (isInfoWindowOpen(infowindow)) {
              infowindow.close(map, marker);
          } else {
              infowindow.open(map, marker);
          }

          function isInfoWindowOpen(infoWindow) {
              var map = infoWindow.getMap();
              return (map !== null && typeof map !== "undefined");
          }
      });

  }