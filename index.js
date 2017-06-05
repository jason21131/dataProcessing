//var csv = require('csv');

//var parse = require('csv-parse');
var fs = require('fs');
var csv = require("fast-csv");

var stream = fs.createReadStream("houseAddress.csv", {encoding:'utf-8',bufferSize:11});

csv
 //.fromPath("houseAddress.csv")
 //.parse()
 .fromStream(stream)
 .on("data", function(data){
     console.log(data[0] + " " + data[2] + " " + data[21]);
 })
 .on("end", function(){
     console.log("done");
     //console.log("我是測試用中文");
 });


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
