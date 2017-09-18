var map;
var markers = [];

function initMap() {
  //hard code location info
  var clubs = [
    {title: 'Hakkasan', location: {lat: 36.101340, lng: -115.172182}},
    {title: 'XS', location: {lat: 36.127938, lng: -115.164742}},
    {title: 'Marquee', location: {lat: 36.109526, lng: -115.174151}},
    {title: 'OneOak', location: {lat: 36.121875, lng: -115.174419}},
    {title: 'Omnia', location: {lat: 36.116940, lng: -115.174354}}
  ];
  //set up infowindows
  var largeInfoWindow = new google.maps.InfoWindow();

  //initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.116940, lng: -115.174354},
    zoom: 13
  });
  
  for( i=0; i<clubs.length; i++) {
    var marker = new google.maps.Marker({
      map: map,
      position: clubs[i].location,
      title: clubs[i].title,
      animation: google.maps.Animation.DROP,
      id: i
    })
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  };
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
};
