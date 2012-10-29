
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
	http.get({
	    host: hostURL,
	    path: mapURL,
	}, function(res) {
	    var body = ""
	    res.on('data', function(data) {
	        body += data;
	    });
			async.waterfall([
				function first(callback){
					res.on('end', function(){
						console.log("first");
					});
						setTimeout(function(){
							callback(null, "1st");
						}, 1000);
				},
				
				function second(callback){
					console.log("second");
					mapJson = body;
					return callback;	
				}
			]);
	});	
	
	console.log(mapJson);
	//response.json();
	res.render('index', { title: 'Express' });
};
