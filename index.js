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
var pretempDataArray = {};
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
				graphDataElement.Elements = [];
				tempDataArray.Symbol = 0;
				for (var h=0; h<testSQlValue.length; h++){
					ticker = testSQlValue[h]["ticker"];
					tickerName = testSQlValue[h]["title"];
					graphDataElement.Normalized = false;
					graphDataElement.NumberOfDays = 365;
					graphDataElement.DataPeriod = "Day";
					graphDataElement.LabelPeriod = "Month"+h;
					tempDataArray.Symbol = ticker;
					tempDataArray.Type = "price";
					tempDataArray.Params = ["c"];
					graphDataElement.Elements.push(tempDataArray);
					graphDataArrayEncoded = JSON.stringify(graphDataElement);
					response.write("<div class='ticker'> <boldHeader >" + ticker + "</boldHeader> <button class='borderless' onclick="+"removeTicker('"+ticker+"')"+">x</button> <br/><br/>" + tickerName + "(" + ticker + ") Prices, 	Dividends, Splits and Trading Volume </div>");
					response.write("<div style='display:hidden;' id='data_block_hidden_"+h+"'>" + graphDataArrayEncoded + "</div>");					
				};
			done();
			fs.readFile('index2.html', 'utf8', function (err,data) {
				if (err) 
				{
					return console.log(err);
				}
				//response.write("<div style='display:block;' id='graphDataArrayEncoded_hidden'>" + graphDataArrayEncoded + "</div>");
				response.end(data);
			});
		});
	});
});
app.get(['/tickersearch/:id/'], function(request, response) {
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
			var titleId = data.Name;
			if (tickerStatus == "SUCCESS")
			{
				pg.connect(process.env.DATABASE_URL, function(err, client, done) 
				{
					var location = "http://stockyier.herokuapp.com/reloadPage";
					var postSqlCustom1 = "DELETE FROM stock_table where ticker = '"+tickerId+"'";
					client.query(postSqlCustom1, function(err, result) 
					{
						if (err)
							{ resultsidSQL = ("Error " + err); }
						else
						{ 
						}
						done();
					});
					var postSqlCustom2 = "INSERT INTO stock_table (ticker, title) VALUES ('"+tickerId+"', '"+titleId+"')";
					client.query(postSqlCustom2, function(err, result) 
					{
						if (err)
							{ resultsidSQL = ("Error " + err); }
						else
						{ 
							response.redirect(location);
							response.end();
						}
						done();
					});
				});
			}
			else
			{
				response.write("Incorrect or not existing stock code");
				response.end();
			}
		});

	}
});
app.get(['/tickerRemove/:id/'], function(request, response) {
	tickerId = request.params.id;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		var location = "http://stockyier.herokuapp.com/reloadPage";
		var postSqlCustom1 = "DELETE FROM stock_table where ticker = '"+tickerId+"'";
		client.query(postSqlCustom1, function(err, result) 
		{
			if (err)
				{ resultsidSQL = ("Error " + err); }
			else
			{
				response.redirect(location);
				response.end();						
			}
			done();
		});
	});

});
app.get(['/reloadPage'], function(request, response) {
	fs.readFile('reloadPage.html', 'utf8', function (err,data) {
		response.write(data);
		response.end();
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});