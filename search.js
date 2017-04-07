const url = require('url');
const mustache = require('mustache');
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;

module.exports.process = function(req, res) {
	var urlParams = url.parse(req.url, true).query;

	console.log(urlParams);

	var searchDoc = {};
	if ('cuisine' in urlParams) {
		searchDoc = {
			'name' : { $ne : null },
			'cuisine' : urlParams["cuisine"]
		};
	} else if ('contains' in urlParams) {
		searchDoc = {
			'name' : { $ne : null },
			'description' : { $regex : ".*" + urlParams['contains'] + ".*" }
		};
	}

	MongoClient.connect("mongodb://localhost:27017/recipes", function(err, db) {
		var collection = db.collection('recipes');
		collection.find(searchDoc).toArray(function(err, data) {
			console.log(data);
			fs.readFile("./search.html", function(err, content) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');
				res.end(mustache.render(content.toString(), { recipes : data }));
			});
		});
	});
}