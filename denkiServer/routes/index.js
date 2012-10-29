
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.query);
  res.header("Access-Control-Allow-Origin", "*");
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
  var mapJson;  //mapの元Json
  var shops = [];
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
			console.log("mapJson status: " + mapJson.status);
      for(var i=0; i<mapJson.results.length; i++){
        //console.log(mapJson.results[i].title);
        shops[i] = mapJson.results[i].title;
        console.log(mapJson.results[i]);
      }
			callback(null);
		},

    function third(callback){
      hostURL = "api.gnavi.co.jp";
      mapURL = "/ver1/RestSearchAPI/?keyid=d25ce8e3607bc762db3af9d6232cc1eb&name=";
      res.json(mapJson);
      /*
			http.get({
			  host: hostURL,
				path: mapURL,
			}, function(res) {
				res.on('data', function(data) {
	        body += data;
				});
				res.on('end', function(){
					mapJson = JSON.parse(body);
				});
			});
      */
      callback(null);
    }

	]);
	
  /*** function ***/

function makeJSON(hash){
  var init = true;
  var str = '{';
  for(var i in hash){
    if(!init) str += ',';
    str += '"' + i.replace('"', '\\"', 'g') + '":"';
    str += hash[i].replace('"', '\\"', 'g') + '"';
    init = false;
  }
  str += '}';
  return str;
}


};
