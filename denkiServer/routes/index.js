
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
  var gnaviJson;
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
          //gnaviJson = XMLToJSON(body);
           console.log(body);
				});
      });
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


// Changes XML to JSON
function xmlToJson(xml) {
  
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].length) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

function XMLToJSON(ajax)
{
  if (window.ActiveXObject)
  {
    var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.loadXML(ajax.responseText);
  }
  else if (window.DOMParser)
  {
    var xmlDoc = new DOMParser().parseFromString(
      ajax.responseText,
      "application/xml"
      );
  }
  else
  {
    return;
  }
  var loopParse = function(obj)
  {
    var res = {}, cacheTag = {};
    var ob = {}, att = obj.attributes;
    if (att != null && att.length != 0)
    {
      for (var a = 0, lenA = att.length; a < lenA; a++)
      {
        ob[att[a].nodeName.toLowerCase()] = att[a].nodeValue;
      }
      res._attr = ob;
    }
    
    if (obj.childNodes.length > 0)
    {
      for (var i = 0, len = obj.childNodes.length; i < len; i++)
      {
        var ch = obj.childNodes[i];
        if (ch.nodeType == 3)
        {
          if (ch.nodeValue.replace(/[\s|\t|\n]/g, "") == "" ||
              ch.nodeValue == null) continue;
          else return ch.nodeValue;
        }
        else if (ch.nodeType == 1)
        {
          (ch.tagName in cacheTag) ?
            cacheTag[ch.tagName].push(arguments.callee(ch)) :
            cacheTag[ch.tagName] = [arguments.callee(ch)];
        }
      }
    }
    else
    {
      return "";
    }
    for (var p in cacheTag)
    {
      (cacheTag[p].constructor == Array && cacheTag[p].length == 1) ?
        res[p] = cacheTag[p][0] : res[p] = cacheTag[p];
    }
    return res;
  }
  return loopParse(xmlDoc);
}

// Convert a string to XML Node Structure
// Returns null on failure
function textToXML ( text ) {
      try {
        var xml = null;

        if ( window.DOMParser ) {

          var parser = new DOMParser();
          xml = parser.parseFromString( text, "text/xml" );

          var found = xml.getElementsByTagName( "parsererror" );

          if ( !found || !found.length || !found[ 0 ].childNodes.length ) {
            return xml;
          }

          return null;
        } else {

          xml = new ActiveXObject( "Microsoft.XMLDOM" );

          xml.async = false;
          xml.loadXML( text );

          return xml;
        }
      } catch ( e ) {
        // suppress
      }
    }
};
