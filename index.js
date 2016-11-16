var express = require('express'); 
var app = express();
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var url = require("url");
var _screen_name;
var ticker;
var alertVar;
app.set('port', (process.env.PORT || 5000));
app.set("Content-Type", "text/html");
app.get([''], function(request, response) {
var postSqlVar = "SELECT * FROM stock_table";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		fs.readFile('index.html', 'utf8', function (err,data) {
			if (err) 
			{
				return console.log(err);
			}
			response.write(data);
			response.end();
		});
		client.query(postSqlVar, function(err, result) 
		{
		  if (err)
		   { resultsidSQL = ("Error " + err); }
		  else
		   { 
				alertVar = result.rows;
				ticker = "";
				alertVar.forEach(function(value)
				{
					ticker = ticker +  value["ticker"]  + "|";
				});
				ticker = ticker.substring(0, ticker.length - 1);
				response.write( "<div class='hidden' style='display:none' id= 'ticker_hidden'>" + ticker + "</div> <div> This is a Test </div>");
		   }
		   done();
		});
	
	});

	
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});