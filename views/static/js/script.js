/**
 * Created by tyler on 3/23/2018.
 */


var map, heatmap = null;

var blue_style = [
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
]

function initMap() {

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        { "address" : "San Francisco" },
        function(results) {
            var location = results[0].geometry.location;

            console.log(location);

            // create a map centered on San Francisco
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: location.lat(), lng: location.lng()},
                zoom: 10,
                styles: blue_style
            });

            var setHeatmap = function(points){
                if(heatmap == null){
                    heatmap = new google.maps.visualization.HeatmapLayer({
                        data: points,
                        map: map,
                        radius: 20
                    });
                }else{
                    heatmap.setData(points);
                }
            }

            getPoints(location.lat(), location.lng(), setHeatmap);
        }
    );

    // IF YOU EVER WANT TO GET SOMETHING OUTSIDE OF San Francisco

    /*
    Get a new heatmap every time the center changes
    currently just for San Francisco so not needed
    map.addListener('center_changed', function() {
        let lat = map.getCenter().lat();
        let lng = map.getCenter().lng();
        heatmap(lat, lng, setHeatmap);
    });

    Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    */
}

function getPoints(lat, lng, callback) {
    $.ajax({
        type: "GET",
        url: "/heatmap",
        dataType: "json",
        data: {
            lat: lat,
            lng: lng
        },
        success:function(data){
            locations = data.locations;
            let points = [];
            locations.forEach(function(loc){
                points.push(new google.maps.LatLng(loc.lat, loc.lng));
            });
            callback(points);
        },
        error:function(error){
            console.log(error);
        }
    });
}
