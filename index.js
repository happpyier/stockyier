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
	_screen_name = "";
	response.write("Home Page");
	response.end();
});
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port')); 
});