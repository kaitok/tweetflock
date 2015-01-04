// public/javascripts/index.js
define(['jquery'],
          function(jquery) {
          /**
          * Callback function : update #lat and #lng element value.
          */
          function updateLatLng(map) {
                    latlng = map.getCenter();
                    console.log(latlng);
                    $('#lat').text(latlng.lat());
                    $('#lng').text(latlng.lng());
          }

          /**
          * Callback function for an 'init' event of Google Map
          */
          function gmap_init() {
                    var mapOptions = {
                              zoom : 15,
                              center : new google.maps.LatLng(35.6903, 139.7006),
                              mapTypeId :google.maps.MapTypeId.ROADMAP,
                    };

                    var map = new google.maps.Map($('#map-canvas')[0], mapOptions);

                    // add event listener
                    google.maps.event.addListener(map, 'center_changed', function() {
                              updateLatLng(map);
                    });

                    updateLatLng(map);
            }

          /**
          * Load Google Map Asynchronously
          */
          function load_gmap_async() {
                    // gmap's callback function must be an global function
                    window.gmap_init = gmap_init;

                    // Asynchronously load Google Map
                    var api_key = 'AIzaSyA5-5kc5CkooQMOzHc-17ntzVICHjxc8QI';
                    var params = $.param({key : api_key, sensor : 'true', callback : 'gmap_init'});
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'http://maps.googleapis.com/maps/api/js?' + params;
                    document.body.appendChild(script);
          }

          load_gmap_async();
          });