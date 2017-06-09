//var csv = require('csv');

//var parse = require('csv-parse');
var fs = require('fs');
var csv = require("fast-csv");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBAPeRnLPRB6FnWW9Iq6cq19x7NucuLqr4'
});
var jsonfile = require('jsonfile');
var file = 'data.json';

var stream = fs.createReadStream("104_house-value_cleaned.csv", {encoding:'utf-8',bufferSize:11});	//houseAddress.csv city-houseValue.csv
var ws = fs.createWriteStream("my.csv", {defaultEncoding: 'utf8'});
var houseData = [];		//two dimension
var rowCounter = 0; 	//To count the numbers of row
var houseObject = {};
var latlngString = '';
var jsonArray = [];


csv
 //.fromPath("houseAddress.csv")
 //.parse()
 .fromStream(stream)
 .on("data", function(data){
 	houseData[rowCounter] = [];
 	for (var i = 0; i < data.length; i++) {
 		houseData[rowCounter][i] = data[i];
 	}
    //console.log(data[0] + " " + data[2] + " " + data[21]);
    //console.log(data.length);
    //houseData.push(data[2]);
    rowCounter ++;
 })
 .on("end", function(){
     console.log("done");
     //console.log(testArray);

     //getMoreInfomation(outputTheResult);
     //getMoreInfomation(houseData, outputTheArray);
     callMultipleTimes( houseData, tryingToOutputCSV );
     //getMoreInfomation( houseData[6][2], outputTheResult );
     //writingFile( writeCSV );

     //useAPIs();
     //console.log("我是測試用中文");
     //console.log(houseData);
     console.log(rowCounter);
     //console.log(testString);
 });
/*================================================*/

// csv
//    .write([
//        ["a", "b"],
//        ["a1", "b1"],
//        ["a2", "b2"]
//    ], {headers: true})
//    .pipe(writableStream);

// csvStream.pipe(writableStream);
// csvStream.write({a: "a0", b: "b0"});
// csvStream.write({a: "a1", b: "b1"});
// csvStream.write({a: "a2", b: "b2"});
// csvStream.write({a: "a3", b: "b4"});
// csvStream.write({a: "a3", b: "b4"});
// csvStream.end();


/*================================================*/

var geocodeInputObject = {
	address:'',
	language: 'zh-TW'
}
var reverseGeocodeInputObject = {
	latlng:'',
	language: 'zh-TW'
}

var csvStream = csv.createWriteStream({headers: true}),
writableStream = fs.createWriteStream("CompleteTest4.csv", {defaultEncoding: 'utf8'});

// var testString = '嘉義縣太保市北港路二段429巷200弄31~60號';
// var testArray = [];
// testArray.push(testString);
// testArray.push('嘉義縣水上鄉南和村15鄰後寮61~90號');
//console.log(testArray);

function getAddress( inputAdress, callbackFunction ){
	geocodeInputObject.address = inputAdress;
	var str;
	googleMapsClient.geocode(geocodeInputObject, function(err, response){
		str = response.json.results[0].geometry.location.lat;
		str += ',';
		str += response.json.results[0].geometry.location.lng;

		callbackFunction( str );
	});
	//callbackFunction( str );
	//console.log(str);
}

function getMoreInfomation( inputAdress, callbackFunction ){
	getAddress( inputAdress, function( output ){		//input the origin address #testString
		//console.log(output);
		reverseGeocodeInputObject.latlng = output;
		googleMapsClient.reverseGeocode( reverseGeocodeInputObject, function(err, response){
			if (!err) {
				//callbackFunction( response.json.results[0].address_components );
				//resultArray.push( response.json.results[0] );
				callbackFunction( response.json.results[0] );
			}
		});
	});
}

function outputTheResult(output){
	var file = 'data.json';

	console.log(output);

	jsonfile.writeFile(file, output, function (err) {
	  console.error(err);
	})
}

function callMultipleTimes( array, callbackFunction ){
	//var csvStream = csv.createWriteStream({headers: true}),
	//writableStream = fs.createWriteStream("CompleteTest.csv", {defaultEncoding: 'utf8'});
	csvStream.pipe(writableStream);			//must be here
	for( var i=0; i<array.length; i++ ){
		getMoreInfomation( array[i][2], function( output ){
			console.log(output.formatted_address);

			//callbackFunction(output.formatted_address);
			//callbackFunction(array[i], output);
			//output.origin = array[i][2];
			callbackFunction(output);
			//csvStream.write({googleAPI_return_Address: output.formatted_address });
		});
	}
	//csvStream.end();
}

function callingIt( output ){
	console.log(output);
}

function tryingToOutputCSV(output){
	//csvStream.pipe(writableStream);
	csvStream.write({ googleAPI_return_Address: output.formatted_address, lat: output.geometry.location.lat, lng: output.geometry.location.lng });
	
	//var output_JSON_stringify = JSON.stringify(output);
	jsonfile.writeFile(file, output, {flag: 'a'}, function (err) {
	  console.error(err)
	})
	//csvStream.write({ googleAPI_return_Address: output});
	//csvStream.write({ googleAPI_return_Address: output.formatted_address, lat: output.geometry.location.lat});
	//console.log(output);
}

function getRowObject(array, output){
	var infoArray = [];
}

function writingFile( callbackFunction ){
	var infoArray = [];
	getMoreInfomation(function( output ){	//the output is the object from reverse geocode( the address info )
		infoArray.push(output.formatted_address);
		infoArray.push(houseData[6]);
		infoArray.push(output.geometry.location.lat);
		infoArray.push(output.geometry.location.lng);

		callbackFunction( infoArray );
	});
}

function writeCSV( writedInfo ){	//array
	var csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream("testAddress2.csv", {defaultEncoding: 'utf8'});

    csvStream.pipe(writableStream);
    csvStream.write({googleAPI_return_Address: writedInfo[0], 原地址: writedInfo[1], lat: writedInfo[2], lng: writedInfo[3] });
    csvStream.end();
}





