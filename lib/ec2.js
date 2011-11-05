

var proto = require('./proto').proto;
var GenericClient = require('./generic').GenericClient;
var _ = require('underscore');

var EC2Client = proto(GenericClient);
exports.EC2Client = function() {
  return EC2Client.make.apply(this, arguments);
};

EC2Client.init = function(opts) {
  opts = _.extend({
    host: "ec2.amazonaws.com",
    path: "/",
    version: '2011-07-15'
  }, opts);
  GenericClient.init.apply(this, arguments);
};

EC2Client.req = function(action, query, callback) {
  _.extend(query, {
    Action: action,
    Version: this.version,
    SignatureMethod: 'HmacSHA256',
    SignatureVersion: '2'
  });
  GenericClient.call.apply(this, arguments);
};

function callGen(action) {
  return function(query, callback) {
    return EC2Client.req(action, query, callback);
  };
}

EC2Client.describeInstances