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
var yelp = require("node-yelp");
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
var _screen_name = "";
var _clientIP;
var _clientUser;
var clientUser;
var clientUser;
var pre_clientUser;
var locationVal;
var pre_buis_name;
var _businesses;
var _buis_name = "";
var _name = "";
var businesses = "";
var pre_buis_snippet;
var _buis_snippet = "";
var _snippet = "";
var pre_buis_image_url;
var _buis_image_url = "";
var _image_url = "";
var	_buis_name_Array;
var	_buis_snippet_Array;
var	_buis_image_url_Array;
var location;
var locationStored = "";
var _testData;
var _count;
var i;
var _searchBarVal = "";
var Almost_clientUser;
var twitter = new Twitter({
	consumerKey: 'n8O7J3KvwZdCvP0i83yv9k3Aq',
	consumerSecret: '4TSijldDtbSl71xp24VZxXZYUdlGAQAxLEqeEG0idD7Qfjwcw8',
	callback: 'https://yelpier.herokuapp.com/windowClose'
});
var yelp = yelp.createClient({
	oauth: {
		"consumer_key": "7dAg-Gi0XU4GQK1pl-YSNw",
		"consumer_secret": "HOg3M2ussnUbXMFY2Q3mBsrdrmo",
		"token": "WPM0LWSJtD0y3C6kqYDFpnjIYSVB--7Z",
		"token_secret": "GRHNx-coBSsG_wFboFlw1mhX6KU"
	}
});
var _requestSecret;
app.set('port', (process.env.PORT || 5000));
app.use(cookieParser());
app.set("Content-Type", "text/html");
app.get([''], function(request, response) 
{
	if (_screen_name.length > 0)
	{
		fs.readFile('indexSignedIn.html', 'utf8', function (err,data) 
		{
			if (_searchBarVal.length > 0)
			{
				response.write(data+"<div class=hidden id='searchValueInput'>" + _searchBarVal + "</div>");
				_searchBarVal = "";
				response.end();
			}
			else
			{
				response.write(data+"<div class=hidden id='searchValueInput'></div>");
				response.end();
			}
		});
		
	}
	else
	{
		fs.readFile('index.html', 'utf8', function (err,data) 
		{
			response.write(data+"<div class=hidden id='searchValueInput'></div>");
			response.end();
		});
	}
});
app.get(['/iframe/:id'], function(request, response) 
{
		// if (_screen_name.length > 0);
		var tempLocation = request.params.id;
		_name = "";
		_snippet = "";
		_image_url = "";
		yelp.search({ terms: "restaurant", location: tempLocation, limit: "20" }).then(function (data) {
			for (i=0; i<20; i++)
			{
				_name = _name + data.businesses[i].name + "|";
				_snippet = _snippet + data.businesses[i].snippet_text + "|";
				_image_url = _image_url + data.businesses[i].image_url + "|";				
			}
			pre_buis_name = JSON.stringify(_name);
			pre_buis_snippet = JSON.stringify(_snippet);
			pre_buis_image_url = JSON.stringify(_image_url);
			_buis_name = pre_buis_name.substring(1, pre_buis_name.length - 2);
			_buis_snippet = pre_buis_snippet.substring(1, pre_buis_snippet.length - 2);
			_buis_image_url = pre_buis_image_url.substring(1, pre_buis_image_url.length - 2);
		});
			_buis_name_Array = _buis_name.split("|");
			_buis_snippet_Array = _buis_snippet.split("|");
			_buis_image_url_Array = _buis_image_url.split("|");
			for (i=0; i<20; i++)
			{
				response.write("<div> <img src='" + _buis_image_url_Array[i] + "'> </img> <div class='block' style='display: inline-block; width:800px; vertical-align:top;'>" + _buis_name_Array[i] + "<br/><i>\"" + _buis_snippet_Array[i] + "</i>\"</div> </div>");
			 }
			response.write(data);
			response.end();
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
		setTimeout(function(){ response.redirect("https://yelpier.herokuapp.com/verifyTwit"); }, 1000);
    }
	});
	
});
app.get('/verifyTwit', function(request, response)
{
	accessToken = _accessToken;
	accessTokenSecret = _accessTokenSecret;
	setTimeout(function()
	{ 
		twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response) 
		{
			if (error) 
			{
				console.log(error);
			} 
			else 
			{
				_screen_name = data["name"];
				response.redirect("https://yelpier.herokuapp.com");
			}
		});
	}, 1000);
	
});

app.get("/twitter/auth/:id", function(req, res) {
	twitter.getRequestToken(function(err, requestToken, requestSecret) {
		_searchBarVal = request.params.id;
		if (err)
			res.status(500).send(err);
		else {
			_requestSecret = requestSecret;
			_requestToken = requestToken;
			res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
		}
	});
});
app.get("/twitter/auth/", function(req, res) {
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

app.get(['/twitter/SignOut'], function(req, res) {
	_screen_name = "";
	res.redirect("https://yelpier.herokuapp.com/");
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});