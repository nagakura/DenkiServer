
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.query);
	/**** read query ****/

	var lat = ""; //緯度
	var lng = ""; //経度
	if(req.query.lat){
		lat = req.query.lat;
	}

	if(req.query.lng){
		lng = req.query.lng;
	}
	
	var n, w, s, e;
	n = lat*1+0.01;
	w = lng*1-0.01;
	s = lat*1-0.01;
	e = lng*1+0.01;
	var hostURL = "oasis.mogya.com";
	var mapURL = "/api/v0/search?n=" + n + "&w=" + w +  "&s=" + s + "&e=" + e;
	
	var url = "http://" + hostURL + mapURL;
	console.log(url);
	
	var async = require("async");
	var http = require('http');
	var mapJson;
	var body = "";
	async.waterfall([
		function first(callback){
			http.get({
			  host: hostURL,
				path: mapURL,
			}, function(res) {
				res.on('data', function(data) {
	        body += data;
				});
				res.on('end', function(){
					mapJson = JSON.parse(body);
          callback(null);
				});
			});
		},
	
		function second(callback){
			console.log(mapJson.results);
			callback(null);
		}

	]);
	


	//response.json();
	res.render('index', { title: 'Express' });
};
