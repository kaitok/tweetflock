  $(function() {

  	var socket = io.connect();

    $('form').submit(function() {
      socket.emit('msg', $('input').val());
      return false;
    });

    socket.on('data', function(data,image_url) {
      console.log(data);
      if(data.geo !== null && data.geo['coordinates'] != null){
        var geo = data.geo['coordinates'];
        var latitude = geo[0];//緯度
        var longitude = geo[1];//経度
        setMapping(latitude,longitude,data,image_url);
      }
    });

    navigator.geolocation.getCurrentPosition(setGeolocation,errorCallback);

    function setGeolocation(pos){
      createMap(pos.coords.latitude,pos.coords.longitude);
    }

    function errorCallback(err){
    }

    function createMap(latitude,longitude){
     var myLatlng = new google.maps.LatLng(latitude, longitude);
     var myOptions = {
      zoom: 5,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
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

  function setMapping(latitude,longitude,data,image_url) {

    var myLatlng = new google.maps.LatLng(latitude,longitude); //経度,緯度
    var marker = new google.maps.Marker({
      position:myLatlng,
      animation:google.maps.Animation.DROP
    });

    var contentTweet = '<div style="width:200px;height:150px;" class="map_text">' + 
    '<dl><dt><a href="http://twitter.com/'+ data.user['screen_name'] + '" target="_blank">' + 
    '<img src="' + data.user['profile_image_url'] + '" target="_blank">' + '</a></dt>' + 
    '<dt>' + data.text + '</dt>' + '</dl>' + '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentTweet,
      disableAutoPan: false
    });

    google.maps.event.addListener(marker, 'click', function() {
      if (isInfoWindowOpen(infowindow))
      {
        infowindow.close(map,marker);
      }else{
        infowindow.open(map,marker);
      }
    });

    function isInfoWindowOpen(infoWindow){
      var map = infoWindow.getMap();
      return (map !== null && typeof map !== "undefined");
    }

    marker.setMap(map);
  }
