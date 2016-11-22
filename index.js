var express = require('express'); 
var app = express();
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var highcharts = require('node-highcharts');
// require('highcharts/modules/exporting')(Highcharts);
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
var options = {
        chart: {
            width: 300,
            height: 300,
            defaultSeriesType: 'bar'
        },
        legend: {
            enabled: false
        },
        title: {
            text: 'Highcharts rendered by Node!'
        },
        series: [{
            data: [ 1, 2, 3, 4, 5, 6 ]
        }]
    };
app.set('port', (process.env.PORT || 5000));
app.set("Content-Type", "text/html");
app.get([''], function(request, response) {
	var queryForSQL = "SELECT * FROM stock_table";
	fs.readFile('index.html', 'utf8', function (err,data) {
		response.write(data);
	});
	// highcharts.render(options, function(err, data) {
		// if (err) {
			// console.log('Error: ' + err);
		// } else {
			// fs.writeFile('chart.png', data, function() {
				// console.log('Written to chart.png');
			// });
		// }
	// });
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryForSQL, function(err, result) {
				testSQlValue = result.rows;
				
				testSQlValue.forEach(function(value){
					ticker = value["ticker"];
					tickerName = value["title"];
					markit.getQuote(ticker, function(err, data) {
						graphDataElement.Elements = [];
						graphDataElement.Normalized = false;
						graphDataElement.NumberOfDays = 365;
						graphDataElement.DataPeriod = "Day";
						graphDataElement.LabelPeriod = "Month";
						graphDataElementName = ticker;
						tempDataArray.Symbol = graphDataElementName;
						tempDataArray.Type = "price";
						tempDataArray.Params = ["c"];
						graphDataElement.Elements.push(tempDataArray);
					});
					response.write("<div class='ticker'> <boldHeader >" + ticker + "</boldHeader> <button class='borderless' onclick="+"removeTicker('"+ticker+"')"+">x</button> <br/><br/>" + tickerName + "(" + ticker + ") Prices, 	Dividends, Splits and Trading Volume </div>");
				});
				graphDataArrayEncoded = JSON.stringify(graphDataElement);
			done();
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