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
var tickerName2 = "";
var tickerId = "";
var tickerStatus = "";
var alertVar;
var graphDataElement = {};
var graphDataArray = [];
var tempDataArray = {};
var pregraphDataArrayEncoded;
var graphDataArrayEncoded;
var graphDataElementName = "";
app.set('port', (process.env.PORT || 5000));
app.set("Content-Type", "text/html");
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
						graphDataElementName = ticker;
						graphDataElement.Elements = [];
						tempDataArray.Symbol = graphDataElementName;
						tempDataArray.Type = "price";
						tempDataArray.Params = ["c"];
						graphDataElement.Elements.push(tempDataArray);
						graphDataArrayEncoded = JSON.stringify(graphDataElement);
					});
					response.write("<div class='ticker'> <boldHeader>" + ticker + "</boldHeader> <br/><br/>" + tickerName + "(" + ticker + ") Prices, 	Dividends, Splits and Trading Volume </div>");
				});
			done();
			// json?parameters={"Normalized":false,"NumberOfDays":365,"DataPeriod":"Day","Elements":[{"Symbol":"AAPL","Type":"price","Params":["c"// ]}]}
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
app.get(['/tickersearch/:id'], function(request, response) {
	tickerId = request.params.id;
	if (tickerId == "invalid")
	{
		response.write("Incorrect or not existing stock code");
		response.end();
	}
	else
	{
		markit.getQuote(tickerId, function(err, data) {
			tickerStatus = data.Status;
		});
		if (tickerStatus == "SUCCESS")
		{
			response.write("Success");
			response.end();
		}
		else
		{
			response.write("Incorrect or not existing stock code");
			response.end();
		}
	}
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});