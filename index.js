var express = require('express'); 
var app = express();
var pg = require('pg');
const https = require('https');
const fs = require('fs');
var path = require("path");
var url = require("url");
app.use(cookieParser());
app.set("Content-Type", "text/html");
app.get(['/twitter/SignOut'], function(req, res) {
	_screen_name = "";
	res.redirect("https://yelpier.herokuapp.com/");
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});