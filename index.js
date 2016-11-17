var express = require('express'); 
var app = express();
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var url = require("url");
var markit = require('node-markitondemand');
var _screen_name;
var ticker;
var tickerName = "";
var alertVar;
app.set('port', (process.env.PORT || 5000));
app.set("Content-Type", "text/html");
//http://dev.markitondemand.com/MODApis/Api/v2/Quote?symbol=FB API to use for market info.
app.get([''], function(request, response) {
	var queryForSQL = "SELECT * FROM stock_table";
	fs.readFile('index.html', 'utf8', function (err,data) {
		response.write(data);
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryForSQL, function(err, result) {
				testSQlValue = result.rows;
				testSQlValue.forEach(function(value){
					ticker = value["ticker"];
						response.write( "<div class='ticker'> <boldHeader>" + ticker + "</boldHeader> <br/><br/>" + tickerName + "(" + ticker + ") Prices, 	Dividends, Splits and Trading Volume </div>");
				});
			done();
			fs.readFile('index2.html', 'utf8', function (err,data) {
				if (err) 
				{
					return console.log(err);
				}
				response.end(data);
			});
		});
	});
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});