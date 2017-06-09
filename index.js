//var csv = require('csv');

//var parse = require('csv-parse');
var fs = require('fs');
var csv = require("fast-csv");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyChFX7wwDZIzWdGGglTUuRz7HIOAJe2Mvg'
});
var jsonfile = require('jsonfile');
var file = 'data2.json';

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
writableStream = fs.createWriteStream("104_house_data_complete8.csv", {defaultEncoding: 'utf8'});

// var testString = '嘉義縣太保市北港路二段429巷200弄31~60號';
// var testArray = [];
// testArray.push(testString);
// testArray.push('嘉義縣水上鄉南和村15鄰後寮61~90號');
//console.log(testArray);

function getAddress( inputAdress, callbackFunction ){
	geocodeInputObject.address = inputAdress;
	var str;
	googleMapsClient.geocode(geocodeInputObject, function(err, response){
		//console.log(response.status);
		//console.log(response.json.results[0]);
		if( response.json.results[0] ){
			str = response.json.results[0].geometry.location.lat;
			str += ',';
			str += response.json.results[0].geometry.location.lng;

			//callbackFunction( str );
			//console.log(str);
		}
		else{			//if undefined give the assigned latlng
			str = "25.0265985,121.4178347";	//assign the
			//callbackFunction( str );
		}
		callbackFunction( str );
	});
	//callbackFunction( str );
	//console.log(str);
}

function getMoreInfomation( inputAdress_array, callbackFunction ){
	var inputAdress = inputAdress_array[2];
	getAddress( inputAdress, function( output ){		//input the origin address #testString
		//console.log(output);
		reverseGeocodeInputObject.latlng = output;
		googleMapsClient.reverseGeocode( reverseGeocodeInputObject, function(err, response){
			if (!err) {
				//callbackFunction( response.json.results[0].address_components );
				//resultArray.push( response.json.results[0] );
				callbackFunction( inputAdress_array, response.json.results[0] );
			}
			else{
				console.log("can't get info");
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
	for( var i=2501; i<=3000; i++ ){
		//var addr = array[i][2];
		getMoreInfomation( array[i], function( addr_array, output ){

			//console.log(output.formatted_address);

			//callbackFunction(output.formatted_address);
			//callbackFunction(array[i], output);
			//output.origin = array[i][2];
			callbackFunction(addr_array, output);
			//csvStream.write({googleAPI_return_Address: output.formatted_address });
		});
	}
	//csvStream.end();
}

function callingIt( output ){
	console.log(output);
}

function tryingToOutputCSV(orginArray, output){
	//csvStream.pipe(writableStream);
	var address_components = output.address_components;
	var level4;

	for (var i = 0; i < address_components.length; i++) {
		if( address_components[i].types[0] == "administrative_area_level_4" )
			level4 = address_components[i].long_name;
	}
	//if(  )
	var correctOputting = {
		年月: orginArray[0],
		房屋類型: orginArray[1], 
		地址: orginArray[2],
		屋齡: orginArray[3],
		格局: orginArray[4],
		出售樓層_總樓層: orginArray[5],
		建物坪數: orginArray[6],
		土地坪數: orginArray[7],
		車位坪數: orginArray[8],
		車位總價: orginArray[9],
		每坪單價: orginArray[10],
		成交總價: orginArray[11],
		googleAPI_return_Address: output.formatted_address, 
		lat: output.geometry.location.lat, 
		lng: output.geometry.location.lng, 
		street: level4
	};

	if( correctOputting.googleAPI_return_Address == "242台灣新北市新莊區富國路2號" ){
		correctOputting.googleAPI_return_Address = "找不到位址";
		correctOputting.lat = "無";
		correctOputting.lng = "無";
		correctOputting.street = "無";
	}


	//csvStream.write({ Test: orginArray[1], orgin: orginArray[2], googleAPI_return_Address: output.formatted_address, lat: output.geometry.location.lat, lng: output.geometry.location.lng, street: level4 });
	csvStream.write(correctOputting);

	output.orgin = orginArray[2];
	//var output_JSON_stringify = JSON.stringify(output);
	jsonfile.writeFile(file, output, {flag: 'a'}, function (err) {
	  //console.error(err)
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





