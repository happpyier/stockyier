var express = require('express'); 
var app = express();
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var url = require("url");
var _screen_name;
app.set('port', (process.env.PORT || 5000));
app.set("Content-Type", "text/html");
app.get([''], function(request, response) {
var postSqlVar = "SELECT * FROM stock_table";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar, function(err, result) 
		{
		  if (err)
		   { resultsidSQL = ("Error " + err); }
		  else
		   { 
				alertVar = result.rows;
				// randid_vote = "";
				// votechoose_vote = "";
				// votes_vote = "";
				// uservoted_vote = "";
				// ipvoted_vote = "";
				// title_vote = "";
				// votedalready = "";
				// alertVar.forEach(function(value)
				{
					// randid_vote = value["randid"];
					// votechoose_vote = votechoose_vote +  value["votechoose"]  + "|";
					// votes_vote = votes_vote +  value["votes"]  + "|";
					// uservoted_vote = uservoted_vote +  value["uservoted"]  + "|";
					// ipvoted_vote = ipvoted_vote +  value["ipvoted"]  + "|";
					// title_vote = value["title"] ;
					// votedalready = votedalready +  value["votedalready"]  + "|";
				});
				// votechoose_vote = votechoose_vote.substring(0, votechoose_vote.length - 1);
				// votes_vote = votes_vote.substring(0, votes_vote.length - 1);
				// uservoted_vote = uservoted_vote.substring(0, uservoted_vote.length - 1);
				// ipvoted_vote = ipvoted_vote.substring(0, ipvoted_vote.length - 1);
				// votedalready = votedalready.substring(0, votedalready.length - 1);			
				// response.write( "<div class='hidden' style='display:none' id= 'randid_hidden'>" + randid_vote + "</div> <div class='hidden' style='display:none' id= 'votechoose_hidden'>" + votechoose_vote + "</div> <div class='hidden' style='display:none' id= 'votes_hidden'>" + votes_vote + "</div> <div class='hidden' style='display:none' id= 'uservoted_hidden'>" + uservoted_vote + "</div> <div class='hidden' style='display:none' id= 'ipvoted_hidden'>" + ipvoted_vote + "</div> <div class='hidden' style='display:none' id= 'title_hidden'>" + title_vote + "</div> <div class='hidden' style='display:none' id= 'alreadyvoted'>" + votedalready + "</div>"	);
		   }
		   done();
			// if (_screen_name.length > 0)
			// {
				// fs.readFile('thispollSignedIn.html', 'utf8', function (err,data) {
					// if (err) 
					// {
						// return console.log(err);
					// }
					// response.write(data);
					// response.end();
				// });
			
			// }
			// else
			// {
				// fs.readFile('thispoll.html', 'utf8', function (err,data) {
					// if (err) 
					// {
						// return console.log(err);
					// }
					// response.write(data);
					// response.end();
				// });
			// }
		});

	});
	fs.readFile('index.html', 'utf8', function (err,data) {
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