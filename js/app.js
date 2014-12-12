//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

/* app.js -- our application code */

"use strict";
$(document).ready(function() {
	var mapElem = document.getElementById('map');

	var position = {
		center: {lat: 47.6, lng: -122.3}, //47.660912 -122.313637
		zoom: 12
	};
	var infoWin = new google.maps.InfoWindow();
	var map = new google.maps.Map(mapElem, position);
	var cameras;
	var markers = [];



	// List of Seattle Traffic Cameras
	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			console.log("Success");
			document.getElementById("error-message").style.display = "none";
			cameras = data;

			data.forEach(function(camera) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					map: map
				});
				markers.push(marker);
				google.maps.event.addListener(marker, 'click', onMarkerClick)
				function onMarkerClick() {
					var source = '<h2>' + camera.cameralabel + '</h2>';
					source = source + '<img src=' + camera.imageurl.url + '>';
					map.panTo(marker.position);
					infoWin.setContent(source);
					infoWin.open(map, this);
				}
			});
		})
		.fail(function(error) {
			console.log("Fail")
			document.getElementById("error-message").style.display = "block";
	        document.getElementById("error-message").style.color = "red";
	        document.getElementById("error-message").innerHTML = "Sorry our request to access the JSON has failed";
		})
		.always(function() {
			//called on either success or error cases
		})

	$("#search").bind('search keyup', function(camera) {
	    cameras.forEach(function(camera, index) {
	        var label = camera.cameralabel.toLowerCase();
	        var exists = label.indexOf($("input").val().toLowerCase());
	        if (exists == -1) {
	            markers[index].setMap(null);
	        } else {
	            markers[index].setMap(map);
	        }
	    });
	});
});