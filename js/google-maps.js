var infowindow;
var map;
var geocoder;
var bermudaTriangle;
var ctaLayer;
var polygonList = {}


function load() {
	navigator.geolocation.getCurrentPosition(userLocation, error);
}

function initialize(lat, lng) {

	var mapOptions = {
		zoom: 16,
		center: new google.maps.LatLng(37.410483, -122.059758),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(lat, lng),
		zIndex: 1
	});

	google.maps.event.addListener(marker, 'click', function() {
		if (infowindow) infowindow.close();
		infowindow = new google.maps.InfoWindow({
			content: generateInfo(),
			maxWidth: 310
		});
		infowindow.open(map, marker);
	});
	
	for (var key in places) {
		if (places.hasOwnProperty(key)) {
			var polygonCoords = [];
			var polygon;
			for (var i = 0; i < places[key].length; i++) {
				var coords = places[key][i];
				var lat = coords[1];
				var lng = coords[0];
				polygonCoords.push(new google.maps.LatLng(lat, lng));
			};
			polygon = new google.maps.Polygon({
				paths: polygonCoords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35
			});
			polygon.setMap(map);
			polygonList[key] = polygon;
		}
	}
	console.log(polygonList);
}

function codeAddress(place) {

	var address = place;

	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

function generateInfo() {
	text = '<div class="marker">';
	text += '<p> This is you! </p>';
	text += '</div>';
	return text;
}

function haversine(nlat, nlong, mlat, mlong, distance) {

	var R = 6371; // radius of earth in km
	var distances = [];
	var closest = -1;
	var dLat = rad(mlat - nlat);
	var dLong = rad(mlong - nlong);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(nlat)) * Math.cos(rad(nlat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	if (d < distance) {
		return 1;
	} else {
		return 0;
	}
}

function rad(x) {
	return x * Math.PI / 180;
}

google.maps.event.addDomListener(window, 'load', load)
var userLocation = function(pos) {
	var lat = pos.coords.latitude;
	var lng = pos.coords.longitude;
	initialize(lat, lng);
}

var error = function(error) {
	if (error.code === 1) {
		alert('Unable to get location');
	}
}