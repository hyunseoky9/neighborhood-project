var map;
var markers = [];

function initMap() {
  var clubs = [
    {title: 'Hakkasan', location: {lat: 36.101340, lng: -115.172182}},
    {title: 'XS', location: {lat: 36.127938, lng: -115.164742}},
    {title: 'Marquee', location: {lat: 36.109526, lng: -115.174151}},
    {title: 'OneOak', location: {lat: 36.121875, lng: -115.174419}},
    {title: 'Omnia', location: {lat: 36.116940, lng: -115.174354}}
  ];
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.116940, lng: -115.174354},
    zoom: 13
  });
  var tribeca = {lat: 40.719526, lng: -74.0089934};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!',
    animation: google.maps.Animation.DROP
  });
  var infowindow = new google.maps.InfoWindow({
      content: 'What the fuck Martha you little shit'
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
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
};
