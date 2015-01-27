  $(function() {

      var socket = io.connect();

      $('form').submit(function() {
          socket.emit('msg', $('input').val());
          return false;
      });

      socket.on('data', function(data, image_url) {
          if (data !== null && data.geo != undefined && data.geo['coordinates'] !== null) {
              var geo = data.geo['coordinates'];
              var latitude = geo[0]; //緯度
              var longitude = geo[1]; //経度
              setMapping(latitude, longitude, data, image_url);
          }
      });

      navigator.geolocation.getCurrentPosition(setGeolocation, errorCallback);

      function setGeolocation(pos) {
          createMap(pos.coords.latitude, pos.coords.longitude, 5);
      }

      function errorCallback(err) {
          createMap('24.37', '160.76', 2);
      }

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
                  mapTypeIds: [
                      google.maps.MapTypeId.ROADMAP,
                      google.maps.MapTypeId.SATELLITE,
                  ],
                  position: google.maps.ControlPosition.BOTTOM_LEFT
              }
          };
          var canvas = $('#map_canvas')[0];
          map = new google.maps.Map(canvas, myOptions);
      }

      //var styleOptions = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"},{"weight":"0.20"},{"lightness":"28"},{"saturation":"23"},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#494949"},{"lightness":13},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];
      //var styledMapOptions = { name: 'tweetflock' }
      //var sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
      //map.mapTypes.set('tweetflock', sampleType);
      //map.setMapTypeId('tweetflock');
  });

  var map;

  function setMapping(latitude, longitude, data, image_url) {

      var myLatlng = new google.maps.LatLng(latitude, longitude); //経度,緯度
      var marker = new google.maps.Marker({
          position: myLatlng,
          animation: google.maps.Animation.DROP
      });

      marker.setMap(map);

      var contentTweet = {};
      contentTweet.body = '<div class="media tweet_window"><div class="media-left  media-middle"><a href="http://twitter.com/' + data.user['screen_name'] + '" target="_blank"><img class="media-object" src="' + data.user['profile_image_url'] + '" target="_blank"></a></div><div class="media-body"><p class="media-heading">' + data.text + '</p></div></div>';
      contentTweet.marker = marker;

      $('#tweet_box').prepend(contentTweet.body);
      $('#tweet_box').prepend(contentTweet.marker);

      var infowindow = new google.maps.InfoWindow({
          content: contentTweet.body,
          disableAutoPan: false
      });

      google.maps.event.addListener(marker, 'click', function() {

          if (isInfoWindowOpen(infowindow)) {
              infowindow.close(map, marker);
          } else {
              if (map.zoom <= 10) {
                  map.setZoom(10);
                  map.setCenter(marker.getPosition());
              }
              infowindow.open(map, marker);
          }
      });

      // prependしてるので $('.tweet_window')の先頭 [0] がmarkerに紐づくdiv.tweet_window
      //その div.tweet_window の onclickにmarkerのクリックイベントを発火する関数をセット
      $('.tweet_window')[0].onclick =  function () {
          google.maps.event.trigger(marker, 'click');
      };

      var tweetWindow = $(".tweet_window");
      google.maps.event.addDomListener(tweetWindow, "click", function() {
          google.maps.event.trigger(marker, "click");
      });

      function isInfoWindowOpen(infoWindow) {
          var map = infoWindow.getMap();
          return (map !== null && typeof map !== "undefined");
      }
  }

  function show(obj) {
      if (map.zoom <= 10) {
          map.setZoom(10);
          map.setCenter(this.marker.getPosition());
      }
      infowindow.open(map, marker);
  }
