

var proto = require('./proto').proto;
var GenericClient = require('./generic').GenericClient;
var _ = require('underscore');

var EC2Client = exports.ec2 = proto(GenericClient);

EC2Client.init = function(opts) {
  opts = _.extend({
    host: "ec2.amazonaws.com",
    path: "/",
    version: '2011-07-15'
  }, opts);
  GenericClient.init.apply(this, arguments);
};

EC2Client.call = function(action, query, callback) {
  _.extend(query, {
    Action: action,
    Version: this.version,
    SignatureMethod: 'HmacSHA256',
    SignatureVersion: '2'
  });
  GenericClient.apply(this, arguments);
};
