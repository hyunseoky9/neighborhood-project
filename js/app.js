//Data
var clubs = [
    {title: 'Hakkasan', location: {lat: 36.101340, lng: -115.172182}},
    {title: 'XS', location: {lat: 36.127938, lng: -115.164742}},
    {title: 'Marquee', location: {lat: 36.109526, lng: -115.174151}},
    {title: '1Oak', location: {lat: 36.121875, lng: -115.174419}},
    {title: 'Omnia', location: {lat: 36.116940, lng: -115.174354}}
  ];

var map;
var markers = [];

///////////////////INITIALIZE MAP & POPULATE EACH VENUE WITH FOURSQUARE INFO//////////////////////
function initMap() {
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
    //bring in JSON data of the venue thru 4square api
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
    venue = venue.response.venues[0]
    var club_id = venue.id

    //bring in JSON data on the photos of the venue thru 4square api
    photo_url = 'https://api.foursquare.com/v2/venues/'+club_id+'/photos?client_id=EFJRVLNR02C5ARL21YDRPO4ZE0CXGEBNMVHQBILAQTIZN3CD&client_secret=4QZXSPT0ZVOKRACO2VOVKFMPLXQGCO2VPJWMLMVTJ4PXVCH5&v=20170605'
    var photo = (function() {
      var photo = null;
      $.ajax({
        async: false,
        global: false,
        url: photo_url,
        dataType: 'json',
        success: function(data) {
          photo = data
        }
      });
      return photo
    })();
    
    prefix = 'https://igx.4sqi.net/img/general/width200'
    imgSrc = prefix + photo.response.photos.items[0].suffix

    clubs[i].address = venue.location.address
    clubs[i].imgSrc = imgSrc
    clubs[i].name = venue.name
    clubs[i].insta = venue.contact.instagram
    clubs[i].phone = venue.contact.phone
    //console.log(clubs)

    /////////////////////PUTS MARKERS////////////////////////
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
      info = clubs[marker.id]
      var output = '<div>'
      output += '<img src="'+info.imgSrc+'", alt="img">'
      output += '<p>'+ info.name +'</p>'
      output += '<p> address:'+ info.address +'</p>'
      output += '<p> IG:'+ info.insta +'</p>'
      output += '<p> phone#:'+ info.phone +'</p>'
      output += '</div>'
      infowindow.marker = marker;
      infowindow.setContent(output);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
  //tell map to fit the markers into the map
  map.fitBounds(bounds)
};

console.log(markers);  

var Club = function(data) {

};

var ViewModel = function() {

}