var express = require('express'); 
var app = express();
var cookieParser = require('cookie-parser');
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var url = require("url");
var OAuth = require('oauth').OAuth;
var Twitter = require("node-twitter-api");
var merge = require('merge');
var yelp = require('node-yelp-api');
var randid_vote = "";
var votechoose_vote = "";
var votes_vote = "";
var uservoted_vote = "";
var ipvoted_vote = "";
var title_vote = "";
var votedalready = "";
var _requestSecret;
var _requestToken;
var _accessToken;
var _accessTokenSecret;
var _screen_name = "test";
var _clientIP;
var _clientUser;
var clientUser;
var clientUser;
var pre_clientUser;
var Almost_clientUser;
var options = 
{
	consumer_key: '7dAg-Gi0XU4GQK1pl-YSNw',
	consumer_secret: 'HOg3M2ussnUbXMFY2Q3mBsrdrmo',
	token: 'WPM0LWSJtD0y3C6kqYDFpnjIYSVB--7Z',
	token_secret: 'GRHNx-coBSsG_wFboFlw1mhX6KU',
};
var parameters = 
{
	term: 'restaurant',
	location: '33611',
};
var twitter = new Twitter({
	consumerKey: 'YZoBVI9Ak2MAxLTRJ460c65Oq',
	consumerSecret: 'UxkG05HcRBlOmOVLvcHM9AlFStHStUMKwtuCKXM0nwtbm5IJAP',
	callback: 'https://happpypr.herokuapp.com/windowClose'
});

app.set('port', (process.env.PORT || 5000));
app.use(cookieParser());
app.set("Content-Type", "text/html");
app.get([''], function(request, response) 
{
	
	if (_screen_name.length > 0)
	{
		fs.readFile('indexSignedIn.html', 'utf8', function (err,data) 
		{
			if (err) 
			{
				return console.log(err);
			}
			response.write(data);
			yelp.search(merge(options, parameters), function (data)
			{
				response.write(data);
			}
			});
			
		});
		fs.readFile('indexSignedIn2.html', 'utf8', function (err,data) 
		{
			if (err) 
			{
				return console.log(err);
			}
			response.write(data);
			response.end();
		});
	}
	else
	{
		fs.readFile('index.html', 'utf8', function (err,data) 
		{
			if (err) 
			{
				return console.log(err);
			}
			response.write(data);
			response.end();
		});
	}
});
/*
app.get(['', '/polls'], function(request, response) {
	var postSqlVarRandId = "SELECT randid FROM vote_tb LIMIT 50";
	var postSqlVarTitle = "SELECT title FROM vote_tb LIMIT 50";
	var queryForSQL = "SELECT DISTINCT randid, title FROM vote_tb LIMIT 50";
	if (_screen_name.length > 0)
	{
		fs.readFile('indexSignedIn.html', 'utf8', function (err,data) {
			if (err) 
			{
				return console.log(err);
			}
			response.write(data+"<div id='poll_results'>");
		});
	
	}
	else
	{
		fs.readFile('index.html', 'utf8', function (err,data) {
			if (err) 
			{
				return console.log(err);
			}
			response.write(data+"<div id='poll_results'>");
		});
	}
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryForSQL, function(err, result) {
			if (err)
		    {
				resultsidSQL = ("Error term" + err);
			}
			else
		    {
				
				testSQlValue = result.rows;
				testSQlValue.forEach(function(value){
					response.write("<a href=\'https://happpypr.herokuapp.com/polls/" + value["randid"] + "\'><div 'class='resultsPoll'>" + value["title"] + "</div></a>");
				});
			}
			done();
			fs.readFile('footer.html', 'utf8', function (err,data) {
				if (err) 
				{
					return console.log(err);
				}
				response.end(data);
			});
		});
	});
});

app.get('/polls/:id', function(request, response) {
	var pickId = request.params.id;
	var postSqlVar = "SELECT * FROM vote_tb WHERE randid LIKE \'"+pickId+"\'";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar, function(err, result) 
		{
		  if (err)
		   { resultsidSQL = ("Error " + err); }
		  else
		   { 
				alertVar = result.rows;
				randid_vote = "";
				votechoose_vote = "";
				votes_vote = "";
				uservoted_vote = "";
				ipvoted_vote = "";
				title_vote = "";
				votedalready = "";
				alertVar.forEach(function(value)
				{
					randid_vote = value["randid"];
					votechoose_vote = votechoose_vote +  value["votechoose"]  + "|";
					votes_vote = votes_vote +  value["votes"]  + "|";
					uservoted_vote = uservoted_vote +  value["uservoted"]  + "|";
					ipvoted_vote = ipvoted_vote +  value["ipvoted"]  + "|";
					title_vote = value["title"] ;
					votedalready = votedalready +  value["votedalready"]  + "|";
				});
				votechoose_vote = votechoose_vote.substring(0, votechoose_vote.length - 1);
				votes_vote = votes_vote.substring(0, votes_vote.length - 1);
				uservoted_vote = uservoted_vote.substring(0, uservoted_vote.length - 1);
				ipvoted_vote = ipvoted_vote.substring(0, ipvoted_vote.length - 1);
				votedalready = votedalready.substring(0, votedalready.length - 1);			
				response.write( "<div class='hidden' style='display:none' id= 'randid_hidden'>" + randid_vote + "</div> <div class='hidden' style='display:none' id= 'votechoose_hidden'>" + votechoose_vote + "</div> <div class='hidden' style='display:none' id= 'votes_hidden'>" + votes_vote + "</div> <div class='hidden' style='display:none' id= 'uservoted_hidden'>" + uservoted_vote + "</div> <div class='hidden' style='display:none' id= 'ipvoted_hidden'>" + ipvoted_vote + "</div> <div class='hidden' style='display:none' id= 'title_hidden'>" + title_vote + "</div> <div class='hidden' style='display:none' id= 'alreadyvoted'>" + votedalready + "</div>"	);
		   }
		   done();
			if (_screen_name.length > 0)
			{
				fs.readFile('thispollSignedIn.html', 'utf8', function (err,data) {
					if (err) 
					{
						return console.log(err);
					}
					response.write(data);
					response.end();
				});
			
			}
			else
			{
				fs.readFile('thispoll.html', 'utf8', function (err,data) {
					if (err) 
					{
						return console.log(err);
					}
					response.write(data);
					response.end();
				});
			}
		});

	});
});
app.get('/submit/:id/:selection/:titlechoice/:customchoice', function(request, response) 
{
	var pickId = request.params.id;
	var clientIP = request.ip.substring(7);
	pre_clientUser = _screen_name;
	var rePattern = new RegExp(/^([\w\-]+)/);
	Almost_clientUser = pre_clientUser.match(rePattern);
	_clientUser = Almost_clientUser[1];
	var custom_choice = request.params.customchoice;
	var selectionVar = request.params.selection;
	var pickTitle = request.params.titlechoice;
	var postSqlVar1 = "UPDATE vote_tb  SET votedalready = '1' WHERE ipvoted LIKE '"+clientIP+"' AND randid = '"+pickId+"' ";
	var postSqlVar2 = "UPDATE vote_tb  SET votes = votes+1, ipvoted='"+clientIP+"' WHERE votechoose = '"+selectionVar+"' AND randid = '"+pickId+"' ";
	var postSqlCustom = "INSERT INTO vote_tb VALUES ('"+pickId+"', '"+selectionVar+"', 1, '"+_clientUser+"', '"+clientIP+"', '"+pickTitle+"', 0)";
	var location = '/polls/' + pickId;
	if (custom_choice == "custom")
	{
		pg.connect(process.env.DATABASE_URL, function(err, client, done) 
		{
			client.query(postSqlCustom, function(err, result) 
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
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar1, function(err, result) 
		{
			if (err)
				{ resultsidSQL = ("Error " + err); }
			else
			{
				
			}
			done();
		});
	});
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar2, function(err, result) 
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
app.get('/submit/:id/:selection', function(request, response) 
{
	var pickId = request.params.id;
	var clientIP = request.ip.substring(7);
	var selectionVar = request.params.selection;
	var postSqlVar1 = "UPDATE vote_tb  SET votedalready = '1' WHERE ipvoted LIKE '"+clientIP+"' AND randid = '"+pickId+"' ";
	var postSqlVar2 = "UPDATE vote_tb  SET votes = votes+1, ipvoted='"+clientIP+"' WHERE votechoose = '"+selectionVar+"' AND randid = '"+pickId+"' ";
	var location = '/polls/' + pickId;
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar1, function(err, result) 
		{
			if (err)
				{ resultsidSQL = ("Error " + err); }
			else
			{
				
			}
			done();
		});
	});
	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar2, function(err, result) 
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
app.get('/remove/:id', function(request, response) 
{
	var pickId = request.params.id;
	
	var selectionVar = request.params.selection;
	var postSqlVar2 = "DELETE FROM vote_tb WHERE randid = '"+pickId+"'";
	var location = 'https://happpypr.herokuapp.com';

	pg.connect(process.env.DATABASE_URL, function(err, client, done) 
	{
		client.query(postSqlVar2, function(err, result) 
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
app.get('/mypolls', function(request, response) 
{
	if (_screen_name.length > 0)
	{
		fs.readFile('mypollsSignedIn.html', 'utf8', function (err,data) {
			if (err) 
			{
				return console.log(err);
			}
			response.write(data+"<div id='poll_results'>");
		});
	
	}
	else
	{
		response.redirect("https://happpypr.herokuapp.com");
		response.end();
	}
	_clientIP = request.ip.substring(7);
	pre_clientUser = _screen_name;
	var rePattern = new RegExp(/^([\w\-]+)/);
	Almost_clientUser = pre_clientUser.match(rePattern);
	_clientUser = Almost_clientUser[1];
	var queryForSQL = "SELECT DISTINCT randid, title FROM vote_tb WHERE ipvoted LIKE '"+_clientIP+"' OR uservoted LIKE '"+_clientUser+"'";
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(queryForSQL, function(err, result) {
			if (err)
		    {
				resultsidSQL = ("Error term" + err);
			}
			else
		    {
				
				testSQlValue = result.rows;
				testSQlValue.forEach(function(value){
					response.write("<a href=\'https://happpypr.herokuapp.com/polls/" + value["randid"] + "\'><div 'class='resultsPoll'>" + value["title"] + "</div></a>");
				});
			}
			done();
			fs.readFile('footer.html', 'utf8', function (err,data) {
				if (err) 
				{
					return console.log(err);
				}
				response.end(data);
			});
		});
	});
});
app.get('/newpoll', function(request, response)
{
	//NEED to create the rows by title. with seperate votechoose and votes on each row.
	
	if (_screen_name.length > 0)
	{
		fs.readFile('newpollSignedIn.html', 'utf8', function (err,data) {
			if (err) 
			{
				return console.log(err);
			}
			response.write(data);
		});
	
	}
	else
	{
		response.redirect("https://happpypr.herokuapp.com");
	}
});
app.get('/newpoll/submit/:randid/:title/:votechoose', function(request, response)
{
	if (_screen_name.length > 0)
	{
		var pickRandid = request.params.randid;
		var pickTitle = request.params.title;
		var prepickVotechoose = request.params.votechoose;
		var pickId = pickRandid;
		var clientIP = request.ip.substring(7);
		pre_clientUser = _screen_name;
		var rePattern = new RegExp(/^([\w\-]+)/);
		Almost_clientUser = pre_clientUser.match(rePattern);
		_clientUser = Almost_clientUser[1];
		Almost_pickVotechoose = prepickVotechoose.split("|");
		var pickVotechoose = Almost_pickVotechoose;
		for(var i = 0; i<pickVotechoose.length; i++) 
		{
			var queryInsert = "INSERT INTO vote_tb VALUES ('"+pickRandid+"', '"+pickVotechoose[i]+"', 0, '"+_clientUser+"', '"+clientIP+"', '"+pickTitle+"', 0)";
			var location = '/polls/' + pickId;
			pg.connect(process.env.DATABASE_URL, function(err, client, done) 
			{
				client.query(queryInsert, function(err, result) 
				{
					if (err)
						{ resultsidSQL = ("Error " + err); }
					else
					{ 
						
					}
					done();
				});
			});
		}
		response.redirect(location);
		response.end();
	}
	else
	{
		response.redirect("https://happpypr.herokuapp.com");
	}


});
app.get('/windowClose', function(request, response)
{
	var oauth_verifier = request.param('oauth_verifier');
	requestToken = _requestToken;
	requestTokenSecret = _requestSecret;
	twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
        console.log(error);
    } else {
        _accessToken = accessToken;
		_accessTokenSecret = accessTokenSecret;

    }
	});
	response.redirect("https://happpypr.herokuapp.com/verifyTwit");
});
app.get('/verifyTwit', function(request, response)
{
	accessToken = _accessToken;
	accessTokenSecret = _accessTokenSecret;
	twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) 
	{
		if (error) 
		{
			console.log(error);
		} 
		else 
		{
			_screen_name = data["name"];
		}
	});
	fs.readFile('reloadPage.html', 'utf8', function (err,data) 
	{
		if (err) 
		{
			return console.log(err);
		}
		response.end(data);
	});
});
app.get('/info', function(request, response)
{
	fs.readFile('info.html', 'utf8', function (err,data) 
	{
		if (err) 
		{
			return console.log(err);
		}
		response.end(data);
	});	
});
app.get("/twitter/auth", function(req, res) {
	twitter.getRequestToken(function(err, requestToken, requestSecret) {
		if (err)
			res.status(500).send(err);
		else {
			_requestSecret = requestSecret;
			_requestToken = requestToken;
			res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
		}
	});
});
*/
app.get(['/twitter/SignOut', '/polls/twitter/SignOut', 'newpoll/twitter/SignOut'], function(req, res) {
	_screen_name = "";
	res.redirect("https://happpypr.herokuapp.com");
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});