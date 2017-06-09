var http = require("http");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBAPeRnLPRB6FnWW9Iq6cq19x7NucuLqr4'
});
var url = require('url');
var Client = require('node-rest-client').Client;
var client = new Client();

var geocodeInputObject = {
	address:'',
	language: 'zh-TW'
}


http.createServer(request).listen(3001); 

function request( request, response ){
	var address;		//input address

	var url_parts = url.parse(request.url, true);
	var query = url.parse(request.url).query;
	var pathname = url.parse(request.url).pathname;
	var str;

	var postData = '';
	var address;

	request.addListener('data', function (postDataChunk) {
	  //postData += postDataChunk;
	  address = "嘉義市嘉義市芳德街91~120號";
	});

	request.addListener('end', function () {

	  //response.writeHead(200, {'Content-Type': 'text/plain'});
	  //response.write("You've sent the text: " + query);
	  //response.end();

	  response.writeHead(200, {'Content-Type': 'text/json'});
	  //response.writeHead("Access-Control-Allow-Origin", "*");

	  var api = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyBAPeRnLPRB6FnWW9Iq6cq19x7NucuLqr4"

	  client.get(api, function (data, responseData) {
	      // parsed response body as js object 
	      console.log(data);
	      // raw response 
	      //console.log(responseData);

	      var resultObj = JSON.parse(data);
	      //location = resultObj.results[0].geometry.location.lat;
	      //console.log(location.lat);
	      response.end(JSON.stringify(resultObj));
	  });

	});

	//response.writeHead(200, {'Content-Type': 'text/html'});
	//response.write("Hello");
	//console.log(query);
	response.end();
}

	// geocodeInputObject.address = "嘉義市嘉義市芳德街91~120號";

	// googleMapsClient.geocode(geocodeInputObject, function(err, res){
	// 	str = res.json.results[0].geometry.location.lat;
	// 	str += ',';
	// 	str += res.json.results[0].geometry.location.lng;

	// 	res.writeHead(200, {'Content-Type': 'text/html'});
	// 	console.log( "Works" );
	// 	res.end( str );
	// });