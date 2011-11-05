var http = require("http");
var https = require("https");
var qs = require("querystring");
var crypto = require("crypto");
var events = require("events");
var xml2js = require("xml2js");
var _ = require('underscore');

var proto = require('./proto').proto;


// Returns the hmac digest using the SHA256 algorithm.
function hmacSha256(key, toSign) {
  var hash = crypto.createHmac("sha256", key);
  return hash.update(toSign).digest("base64");
}


var GenericClient = exports.GenericClient = proto();

GenericClient.init = function(opts) {
  _.extend(this, {
    secure: true
  }, opts);
  this.creds = crypto.createCredentials({});
};

GenericClient.req = function(action, query, callback) {
  if (this.secretAccessKey == null || this.accessKeyId == null) {
    throw("secretAccessKey and accessKeyId must be set");
  }
  var now = new Date();
  if (!this.signHeader) {
    // Add the standard parameters required by all AWS APIs
    query["Timestamp"] = now.toISOString();
    query["AWSAccessKeyId"] = this.accessKeyId;
    query["Signature"] = this.sign(query);
  }

  var body = qs.stringify(query);
  var headers = {
    "Host": this.host,
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Content-Length": body.length
  };

  if (this.signHeader) {
    headers["Date"] = now.toUTCString();
    headers["x-amzn-authorization"] =
    "AWS3-HTTPS " +
    "AWSAccessKeyId=" + this.accessKeyId + ", " +
    "Algorithm=HmacSHA256, " +
    "Signature=" + hmacSha256(this.secretAccessKey, now.toUTCString());
  }

  var options = {
    host: this.host,
    path: this.path,
    method: 'POST',
    headers: headers
  };
  var connection = this.secure ? https : http;
  var req = connection.request(options, function (res) {
    var data = '';
    //the listener that handles the response chunks
    res.addListener('data', function (chunk) {
      data += chunk.toString();
    })
    res.addListener('end', function() {
      var parser = new xml2js.Parser();
      parser.addListener('end', function(result) {
        callback(0, result);
      });
      parser.parseString(data);
    })
  });
  req.write(body);
  req.end();
};

/*
 Calculate HMAC signature of the query
 */
GenericClient.sign = function (query) {
  var keys = [];
  var sorted = {};

  for(var key in query) {
    keys.push(key);
  }
  keys = keys.sort();

  for(n in keys) {
    var key = keys[n];
    sorted[key] = query[key];
  }
  var stringToSign = ["POST", this.host, this.path, qs.stringify(sorted)].join("\n");

  // Amazon signature algorithm seems to require this
  stringToSign = stringToSign.replace(/!/g,"%21");
  stringToSign = stringToSign.replace(/'/g,"%27");
  stringToSign = stringToSign.replace(/\*/g,"%2A");
  stringToSign = stringToSign.replace(/\(/g,"%28");
  stringToSign = stringToSign.replace(/\)/g,"%29");

  return hmacSha256(this.secretAccessKey, stringToSign);
};
