var map;
var markers = [];


function initMap() {
  //hard code location info
  var clubs = [
    {title: 'Hakkasan', location: {lat: 36.101340, lng: -115.172182}},
    {title: 'XS', location: {lat: 36.127938, lng: -115.164742}},
    {title: 'Marquee', location: {lat: 36.109526, lng: -115.174151}},
    {title: '1Oak', location: {lat: 36.121875, lng: -115.174419}},
    {title: 'Omnia', location: {lat: 36.116940, lng: -115.174354}}
  ];
  
  //set up infowindows
  var largeInfoWindow = new google.maps.InfoWindow();
  //set up bounds 
  var bounds = new google.maps.LatLngBounds()
  //initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.116940, lng: -115.174354},
    zoom: 13
  });
  
  

  //Make multiple markers and add infowindow infos thru loop.
  for( i=0; i<clubs.length; i++) {
    //bring in JSON data thru 4square api
    search_url = 'https://api.foursquare.com/v2/venues/search?client_id=EFJRVLNR02C5ARL21YDRPO4ZE0CXGEBNMVHQBILAQTIZN3CD&client_secret=4QZXSPT0ZVOKRACO2VOVKFMPLXQGCO2VPJWMLMVTJ4PXVCH5&ll=36.101340,-115.172182&query='+
    clubs[i].title +'&v=20130815'
    var venue = (function () {
      var venue = null;
      $.ajax({
        async: false,
        global: false,
        url: search_url,
        dataType: 'json',
        success: function(data) {
        //console.log(response);
        venue = data
        }
      });
      return venue;
    })();
    console.log(venue.response);

    var marker = new google.maps.Marker({
      map: map,
      position: clubs[i].location,
      title: clubs[i].title,
      animation: google.maps.Animation.DROP,
      id: i
    })
    //put each marker in the array.
    markers.push(marker);
    //Extend the bounds
    bounds.extend(marker.position);
    //click to get info window
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  };
  //populating the marker with info in the info window.
  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
  //tell map to fit the markers into the map
  map.fitbounds(bounds)
};

initMap();