
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
  var other = [];
  var shopJson;
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
      body = "";
			console.log("mapJson status: " + mapJson.status);
      for(var i=0; i<mapJson.results.length; i++){
        //console.log(mapJson.results[i].title);
        shops[i] = mapJson.results[i].title;
        other[i] = mapJson.results[i].other;
        //console.log(mapJson.results[i]);
      }
			callback(null);
		},

    function third(callback){
      var shopname;
      body = "";
      shopname = shops[1];
      res.json(mapJson);
      hostURL = "api.gnavi.co.jp";
      mapURL = "/ver1/RestSearchAPI/?keyid=d25ce8e3607bc762db3af9d6232cc1eb&sort=1&name=" + shopname;

			http.get({
			  host: hostURL,
				path: mapURL,
			}, function(res) {
				res.on('data', function(data) {
	        body += data;
				});
				res.on('end', function(){
					 //shopJson = JSON.parse(body);
           //console.log(body);
				});
      });
      /*
      for(var i=0; i<other.length; i++){
        other[i] = encodeURIComponent(other[i]);
      }
      */
      callback(null);
    },

    function fourth(callback){
      /*
      //for(var i=0; i<other.length; i++){
      body = "";
      hostURL = "ap.mextractr.net";
      mapURL = "/ma8/negaposi_analyzer?out=atom&apikey=7A752236663F32CC8BE05D26F74CFDB1C28B1D10&text=" + encodeURIComponent(other[1]);
      
			http.get({
			  host: hostURL,
				path: mapURL,
			}, function(res) {
				res.on('data', function(data) {
	        body += data;
				});
				res.on('end', function(){
					 
           shopJson = JSON.parse(body);
           console.log("negaposi: " + shopJson.negaposi);
           console.log(shopJson);
           
           console.log(body);
				});
			});
      */
      callback(null);
      //}
      //console.log(other[0]);
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

  function tag_tikan(data)
{
  var str = "";
  str = data;
  var delete01 = new RegExp(/\n/g);
  var delete02 = str.replace(delete01, "");
  var delete03 = new RegExp(/>(.*?)</g);
  var delete04 = delete02.replace(delete03, ">\n$1\n<");
  var rgexp = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
  var hoge01 = delete04.replace(rgexp, "");
  for (var i = 0, j = hoge01.length; i < j; i++) {
  // 前後の空白文字を取り除く
  // 連続する半角スペースを１つにまとめる
  hoge01[i] = hoge01[i].replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');
  hoge01[i] = hoge01[i].replace(/^\s+|\s+$/g,'').replace(/ +/g,'/\n');
  }
  return hoge01;
}

};
