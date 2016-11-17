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
var graphDataElement = {};
var graphDataArray = [];
var pregraphDataArrayEncoded;
var graphDataArrayEncoded;
var graphDataElementName = "";
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
					markit.getQuote(ticker, function(err, data) {
						tickerName = data.Name;
						graphDataElement.Normalized = false;
						 graphDataElement.NumberOfDays = 365;
						graphDataElement.DataPeriod = "Day";
						graphDataElement.LabelPeriod = "Month";
						//graphDataElement.LabelInterval = 1;
						graphDataElementName = ticker;
						graphDataElement.Elements = [];
						graphDataElement.Elements.push('{"Symbol":"'+graphDataElementName+'","Type":"price","Params":["c"]}');
						graphDataArrayEncoded = JSON.stringify(graphDataElement);
					});
					response.write("<div class='ticker'> <boldHeader>" + ticker + "</boldHeader> <br/><br/>" + tickerName + "(" + ticker + ") Prices, 	Dividends, Splits and Trading Volume </div>");
				});
			done();
			//set iframe with id="graph_results" to http://dev.markitondemand.com/Api/v2/InteractiveChart?parameters=graphDataArrayEncoded A JSON encoded InteractiveChartDataInput object
			fs.readFile('index2.html', 'utf8', function (err,data) {
				if (err) 
				{
					return console.log(err);
				}
				response.write("<div style='display:none;' id='graphDataArrayEncoded_hidden'>" + graphDataArrayEncoded + "</div>");
				response.end(data);
			});
		});
	});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});