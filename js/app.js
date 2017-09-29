//Data
var clubs = [
    {title: 'Hakkasan', location: {lat: 36.101340, lng: -115.172182}, id: 0},
    {title: 'XS', location: {lat: 36.127938, lng: -115.164742}, id: 1},
    {title: 'Marquee', location: {lat: 36.109526, lng: -115.174151}, id: 2},
    {title: '1Oak', location: {lat: 36.121875, lng: -115.174419}, id: 3},
    {title: 'Omnia', location: {lat: 36.116940, lng: -115.174354}, id: 4}
  ];

var map;
var markers = [];

///INITIALIZE MAP & POPULATE EACH VENUE WITH FOURSQUARE API/////
function initMap() {
  //set up infowindows
  var largeInfoWindow = new google.maps.InfoWindow();
  //set up bounds 
  var bounds = new google.maps.LatLngBounds();
  //initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.116940, lng: -115.174354},
    zoom: 13
  });
  //temporary search_url
  // How to put a function outside of for loop so you don't have to use closure.
  // src: http://www.albertgao.xyz/2016/08/25/why-not-making-functions-within-a-loop-in-javascript/
  //Bounces the marker and populates the infowindow of the marker.
  function Bouncer(thismarker, l) {
      thismarker.setAnimation(google.maps.Animation.BOUNCE);
      var thatmarker = thismarker;
      setTimeout(function() {
        thatmarker.setAnimation(null);
      }, 2800);
      populateInfoWindow(thismarker, largeInfoWindow, l);
    }
  //Make multiple markers and add infowindow infos thru loop.
  for(var i=0; i<clubs.length; i++) {
    var num = i;
    //bring in JSON data of the venue thru 4square api
    search_url = 'https://api.foursquare.com/v2/venues/search?client_id=EFJRVLNR02C5ARL21YDRPO4ZE0CXGEBNMVHQBILAQTIZN3CD&client_secret=4QZXSPT0ZVOKRACO2VOVKFMPLXQGCO2VPJWMLMVTJ4PXVCH5&ll=36.101340,-115.172182&query='+
    clubs[i].title +'&v=20130815';

    //iwindowmaker(i);

    //PUTS MARKERS;
    var marker = new google.maps.Marker({
      map: map,
      position: clubs[i].location,
      title: clubs[i].title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    //put each marker in the array.
    markers.push(marker);
    //Extend the bounds
    bounds.extend(marker.position);
    //click to get info window and put bounce animation
    marker.addListener('click', listener.bind(null, marker));
  }
  function listener(marker) {
    Bouncer(marker, marker.id);
  }
  //populating the marker with info in the info window.
  function populateInfoWindow(marker, infowindow,k) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      //ajax call to get the infowindow material from 4square
      search = 'https://api.foursquare.com/v2/venues/search?client_id=EFJRVLNR02C5ARL21YDRPO4ZE0CXGEBNMVHQBILAQTIZN3CD&client_secret=4QZXSPT0ZVOKRACO2VOVKFMPLXQGCO2VPJWMLMVTJ4PXVCH5&ll=36.101340,-115.172182&query='+ clubs[k].title +'&v=20130815'; 
      $.ajax({
        url: search,
        dataType: 'json',
        success: function(data) {
          var ve = data.response.venues[0];
          var output = '';
          output += '<div id="'+ clubs[k].title +'">';
          output += '<h3>'+ clubs[k].title +'</h3>';
          output += '<p>Address: '+ ve.location.address +'</p>';
          if (ve.contact.facebookUsername !== undefined) {
            output += '<p>FB: '+ ve.contact.facebookUsername +'</p>';
          } else { output += '<p>FB: None </p>';}
          output += '<p>Phone#: '+ ve.contact.phone +'</p>';
          output += '</div>';
          //append the info in the didden div that google map api can pull from;
          infowindow.setContent(output);
        }
      }).fail(function(e) {alert('Request has failed...');});

      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    }
  }
  //tell map to fit the markers into the map
  map.fitBounds(bounds);
}

//Fallback on google map api not working

function googleError() {
  alert('Sorry, google map api not working...');
}

//KNOCKOUT JS  
//Model
var Club = function(data) {
  this.name = ko.observable(data.title);
  this.id = ko.observable(data.id);
};
//ViewMoedel
var ViewModel = function() {
  var self = this;
  this.clubList = ko.observableArray([]);
  this.query = ko.observable('');

  clubs.forEach(function(item) {
    self.clubList.push( new Club(item) );
  });
  //filtering function. src="https://opensoul.org/2011/06/23/live-search-with-knockoutjs/"
  this.search = function(value) {
    array = self.clubList.removeAll();
    for(var i in markers) {
        markers[i].setMap(null);
    }
    
    for(var x in clubs) {
      if ( clubs[x].title.toLowerCase().search(value.toLowerCase() ) >= 0 ) {
        self.clubList.push( new Club(clubs[x]) );
        markers[clubs[x].id].setMap(map);
      }
    }
  };
  this.query.subscribe(this.search);
//this function allows the menu div to show and hide by clicking the hamburger button
  this.toggle = function() {
    if ( document.getElementById('menu').style.display == "none" ) {
      document.getElementById('menu').style.display = "block";
    } else { document.getElementById('menu').style.display = "none"; }
  };
// this fn allows the infowindow to pop up by clicking the lists in the menu div.
  this.openwindow = function(clickedClub) {
    for ( var i in markers) {
      if (clickedClub.id() == i) {
        google.maps.event.trigger(markers[i],'click');
      }
    }
  };

};
ko.applyBindings( new ViewModel() );