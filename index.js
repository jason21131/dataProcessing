//var csv = require('csv');

//var parse = require('csv-parse');
var fs = require('fs');
var csv = require("fast-csv");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBAPeRnLPRB6FnWW9Iq6cq19x7NucuLqr4'
});

var stream = fs.createReadStream("houseAddress.csv", {encoding:'utf-8',bufferSize:11});
var houseData = [];
var latlngString = '';

csv
 //.fromPath("houseAddress.csv")
 //.parse()
 .fromStream(stream)
 .on("data", function(data){
     console.log(data[0] + " " + data[2] + " " + data[21]);
     houseData.push(data[2]);
 })
 .on("end", function(){
     console.log("done");
     useAPIs();
     //console.log("我是測試用中文");
     //console.log(houseData);
 });

var geocodeInputObject = {
	address:'',
	language: 'zh-TW'
}
var reverseGeocodeInputObject = {
	latlng:'',
	language: 'zh-TW'
}

function useAPIs(){
	var latlng;
	for (var i = 1; i < 20; i++) {
 		console.log("WWWW");
 		//houseData[i]
 		geocodeInputObject.address = houseData[i];
 		console.log(geocodeInputObject);
 		//call APIs
 		function getLatlng(geocodeInputObject) {
 			// body...
 			var local_latlng;
 			googleMapsClient.geocode(geocodeInputObject, function(err, response){
 				var str;
 				if (!err) {
 				    //console.log(response.json.results[0].address_components);
 				    //console.log(response.json.results[0].geometry.location);
 				    //console.log("Work");
 				    //console.log(response.json.results[0].geometry.location.lat);
 				    str = response.json.results[0].geometry.location.lat;
 				    str += ',';
 				    str += response.json.results[0].geometry.location.lng;

 				    //console.log(str);
 				}
 				local_latlng = str;
 				console.log(local_latlng);

 				reverseGeocodeInputObject.latlng = local_latlng;
 				console.log(reverseGeocodeInputObject);
 				googleMapsClient.reverseGeocode(reverseGeocodeInputObject, reverseGeocodeCallback);

 			});
 			//console.log(local_latlng);
 		}
 		getLatlng(geocodeInputObject);
 		//googleMapsClient.geocode(geocodeInputObject, geocodeCallback);
 		//console.log(latlngString);
 		//reverseGeocodeInputObject.latlng = latlng;
 		//call reverse APIs
 		//googleMapsClient.reverseGeocode(reverseGeocodeInputObject, reverseGeocodeCallback);
 	}
}

function geocodeCallback(err, response){
	var str;
	if (!err) {
	    //console.log(response.json.results[0].address_components);
	    //console.log(response.json.results[0].geometry.location);
	    //console.log("Work");
	    //console.log(response.json.results[0].geometry.location.lat);
	    str = response.json.results[0].geometry.location.lat;
	    str += ',';
	    str += response.json.results[0].geometry.location.lng;

	    //console.log(str);
	}
	latlngString = str;
	//console.log(latlngString);
}

function reverseGeocodeCallback(err, response){
	if (!err) {
		console.log(response.json.results[0].address_components);
	}
}	

//address: '嘉義縣民雄鄉文隆村鴨母?1~30號'

// googleMapsClient.geocode({
//   address: '嘉義市蘭州四街31~60號',
//   language: 'zh-TW'
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results[0].address_components);
//   }
// });



function HosueCSV(city, address, value){
	this.city = city;
	this.address = address;
	this.value = value;
}


// var HouseData = [];

// var parser = parse({delimiter: ':'});

// obj,from.path('houseAddress.csv').to.array(function(data){
// 	for( var i; i<data.length; i++ ){
// 		HouseData.push( new HosueCSV(data[i][0], data[i][2], data[i][21]) );
// 	}
// });

//console.log( HouseData );
