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
	fs.readFile('index.html', 'utf8', function (err,data) {
		if (err) 
		{
			return console.log(err);
		}
		response.write(data);
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{

		client.query(postSqlVar, function(err, result) 
		{
		  if (err)
		   { resultsidSQL = ("Error " + err); }
		  else
		   { 
				alertVar = result.rows;
				alertVar.forEach(function(value)
				{
					response.write( "<div class='ticker'> <boldHeader>" + value["ticker"] + "</bolderboldHeader> </div>");

				});
		
		   }
		   done();
		});

	});
	fs.readFile('index2.html', 'utf8', function (err,data) {
		if (err) 
		{
			return console.log(err);
		}
		response.write(data);
		response.end();
	});		
	
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});