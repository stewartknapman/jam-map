var Map = function () {
  this.map_eles = $('[data-map]');
  
  this.map_styles = [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3f434f"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fff7b8"
            },
            {
                "saturation": "10"
            },
            {
                "lightness": "20"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d7e877"
            },
            {
                "lightness": "30"
            },
            {
                "saturation": "10"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f59995"
            },
            {
                "lightness": "50"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f59995"
            },
            {
                "lightness": "20"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b0afd6"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#b0afd6"
            },
            {
                "lightness": "-20"
            }
        ]
    }
];
  
  this.map_options = {
    //center: new google.maps.LatLng(-41.27157,173.281598), <-- this gets adder per each maps location data
    zoom: 11,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
    },
    disableDoubleClickZoom: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
    scaleControl: true,
    scrollwheel: true,
    panControl: true,
    streetViewControl: true,
    draggable : true,
    overviewMapControl: true,
    overviewMapControlOptions: {
      opened: false,
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: this.map_styles,
  };
  
  this._load_maps();
};

Map.prototype._load_maps = function () {
  var _this = this;
  this.map_eles.each(function (i, map_ele) {
    _this._load_map(map_ele);
  });
};

Map.prototype._get_location_data = function (map_ele) {
  var $map_ele = $(map_ele);
  return [
    [$map_ele.data('map-title'), $map_ele.data('map-desc'), $map_ele.data('map-phone'), $map_ele.data('map-email'), $map_ele.data('map-web'), $map_ele.data('map-lat'), $map_ele.data('map-lng'), 'map_pin.png'] // 'https://mapbuildr.com/assets/img/markers/default.png'
  ];
};

Map.prototype._load_map = function (map_ele) {
  // get map locations and set the options center
  var locations = this._get_location_data(map_ele);
  var position = new google.maps.LatLng(locations[0][5], locations[0][6]); // based on the first locations long & lat.
  this.map_options.center = position;
  
  // Build new map
  var map = new google.maps.Map(map_ele, this.map_options);
  
  // Add location marker
  for (i = 0; i < locations.length; i++) {
		if (locations[i][0] =='undefined'){ title ='';} else { title = locations[i][0];}
		if (locations[i][1] =='undefined'){ description ='';} else { description = locations[i][1];}
		if (locations[i][2] =='undefined'){ telephone ='';} else { telephone = locations[i][2];}
		if (locations[i][3] =='undefined'){ email ='';} else { email = locations[i][3];}
    if (locations[i][4] =='undefined'){ web ='';} else { web = locations[i][4];}
    if (locations[i][7] =='undefined'){ markericon ='';} else { markericon = locations[i][7];}
    marker = new google.maps.Marker({
        icon: {
          url: markericon,
          scaledSize: new google.maps.Size(20, 30)
        },
        position: position,
        map: map,
        title: locations[i][0],
        desc: description,
        tel: telephone,
        email: email,
        web: web
    });
    link = (web && web.substring(0, 7) != "http://") ? "http://" + web : web;
    this._bind_info_window(marker, map, title, description, telephone, email, web, link);
  }
};

Map.prototype._bind_info_window = function (marker, map, title, desc, telephone, email, web, link) {
  var infoWindowVisible = (function () {
    var currentlyVisible = false;
    return function (visible) {
      if (visible !== undefined) {
        currentlyVisible = visible;
      }
      return currentlyVisible;
    };
  }());
  iw = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function() {
   if (infoWindowVisible()) {
     iw.close();
     infoWindowVisible(false);
   } else {
     var html= "<div class='gm-style-iw-content'><h4>"+title+"</h4><p>"+desc.replace(/,\s/, ',<br>').replace(/,\s/, ',<br>')+"<p><a href='"+link+"'' >"+web+"<a></div>";
     iw = new google.maps.InfoWindow({content:html});
     iw.open(map,marker);
     infoWindowVisible(true);
   }
  });
  google.maps.event.addListener(iw, 'closeclick', function () {
    infoWindowVisible(false);
  });
};

window.initMap = function () {
  new Map();
};