var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    axios = require('axios'),
    stringify = require('json-stringify-safe');

var port = process.env.PORT || 8080;

var buildAPIUrl = function() {
    const TOKEN = "6baca547742c6f96a6ff71b138424f21";
    return `https://rets.io/api/v2/test/listings?&access_token=${TOKEN}`;
}

// set view engine
app.set("view engine", "ejs");

// static 
app.use(express.static('views/static'));

app.get('/', function (req, res) {
    res.render("index")
});

app.get('/heatmap', function (req, res) {
	let url = buildAPIUrl();

	let params = req.query;

	// console.log("Getting Dataset from URL: " + url);

    axios.get(url, {
    	near: params.lat + "," + params.lng, 
    	//near: "San Francisco"
    }).then(function(response) {
    	let listings = response.data.bundle;
    	let locations = [];

    	// get each listing and extract the long, lat from it
    	listings.forEach(function(listing){
    		locations.push({
    			lat: listing.Latitude,
    			lng: listing.Longitude
    		})
    	})

    	res.json({locations: locations});
    }).catch(function (error) {
    	console.log(error);
    	res.status(400);
    	res.send(error);
  	});
});

server.listen(port);
console.log('Server is listening on port ' + port);