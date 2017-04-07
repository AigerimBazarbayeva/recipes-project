const fs = require('fs');
const http = require('http');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const search = require('./search.js');
const add = require('./add.js');

const server = http.createServer((req, res) => {
	var urlString = req.url;
	console.log(urlString);
	if (urlString.startsWith("/search?") || urlString === "/add") {
		//urlString = urlString.substr(4);
		if (urlString.startsWith("/search")) {
			search.process(req, res); 
		} else if (urlString.startsWith("/add")) {
			add.process(req, res);
		}

	} else {
		var filePath = '.' + req.url;
		if (filePath == './')
			filePath = './main.html';

		var extname = path.extname(filePath);
		var contentType = 'text/html';
		
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.png':
				contentType = 'image/png';
				break;      
			case '.jpg':
				contentType = 'image/jpg';
				break;
		}
		
		fs.readFile(filePath, function(error, content) {
			res.statusCode = 200;
			res.setHeader('Content-Type', contentType);
			res.end(content);
		});	
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});