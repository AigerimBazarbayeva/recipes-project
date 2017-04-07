const url = require('url');
const mustache = require('mustache');
const qs = require('querystring');
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;

module.exports.process = function (req, res) {
	var body = '';
	req.on('data', function (data) {
		body += data;
	});

	req.on('end', function() {
		var POST = qs.parse(body);
		var newDoc = {
			name : POST['name'],
			cuisine : POST['cuisine'],
			description : POST['description']
		};

		console.log("New doc: " + newDoc);

		MongoClient.connect("mongodb://localhost:27017/recipes", function(err, db) {
			var collection = db.collection('recipes');
			collection.insert(newDoc);
			fs.readFile("./loaded.html", function (err, content) {
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html");
				res.end(content);
			})
		});
	});
}