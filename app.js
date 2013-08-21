var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	path = require('path');

server.listen(8000);
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/img'));
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
console.log("hosting on 8000");