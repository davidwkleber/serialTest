
var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('mime');

var SerialPort = require("serialport").SerialPort

var cache = {};

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

// Serve File, looking for cache version else read from disk
function serveStatic(response, cache, absPath) {

	// check if the file is in cache memory
	if (cache[absPath]) {

		// serve file from memory
		sendFile(response, absPath, cache[absPath]);
	} else {
		// File not in memory, check that it exists in file structure
		fs.exists(absPath, function(exists) {
			if (exists) {
				// read file from disk
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(response);
					} else {
						// cache the file and serve it
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}

// create HTTP server using anonymous function to define behavior
var server = http.createServer(function(request, response) {
	var filePath = false;
	// if HTML file is root, server index.html
	// else serve file from public directory
	if (request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;

	serveStatic(response, cache, absPath);
});

// start the HTTP server
server.listen(3000, function() {
	console.log("Server listening on port 3000");
});

// var chatServer = require('./lib/chat_server');
// chatServer.listen(server);

var serialPort = new SerialPort("\\\\.\\COM3", { 
	baudrate: 9600
});

serialPort.on("open", function () {
	console.log('open');
	serialPort.on('data', function(data) {
		console.log('data received: ' + data);
	});
	serialPort.write("y6x", function(err, results) {
		if(err) console.log('err ' + err);
		console.log('results ' + results);
	});
});


