var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path');

server.listen(8000);
app.use("/", express.static(__dirname + '/'));
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
console.log("hosting on 8000");