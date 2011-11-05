var http = require("http");
var https = require("https");
var qs = require("querystring")
var crypto = require("crypto")
var events = require("events")
var xml2js = require("xml2js")


// include specific API clients
//var ec2 = require("./ec2");
//var prodAdv = require("./prodAdv");
//var simpledb = require("./simpledb");
//var sqs = require("./sqs");
//var sns = require("./sns");
//var ses = require("./ses");
//var elb = require("./elb");


exports.ec2 = require('./ec2').ec2;
//exports.createEC2Client = ec2.init(genericAWSClient);
//exports.createProdAdvClient = prodAdv.init(genericAWSClient);
//exports.createSimpleDBClient = simpledb.init(genericAWSClient);
//exports.createSQSClient = sqs.init(genericAWSClient);
//exports.createSNSClient = sns.init(genericAWSClient);
//exports.createSESClient = ses.init(genericAWSClient);
//exports.createELBClient = elb.init(genericAWSClient);
