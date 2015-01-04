var map;
$(document).ready( function () {
  var myLatlng = new google.maps.LatLng('35.6582', '139.7456');
  var myOptions = {
    zoom: 5,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
});

function setMapping(latitude,longitude) {
  var myLatlng = new google.maps.LatLng(latitude,longitude); //経度,緯度
  var marker = new google.maps.Marker({
    position:myLatlng,
    animation:google.maps.Animation.DROP
  });

  marker.setMap(map);
}