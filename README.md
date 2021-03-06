Node.js library for the Amazon Web Services
=====

## About this fork ##

I forked and rewrote much of this library to support two goals, in support of developing [Legion](https://github.com/tillberg/legion):
- Properly return error values as the first callback argument (and return errors as appropriate)
- Do something a little nicer than having a single .call(...) method for all requests

Then I noticed [aws2js](https://github.com/SaltwaterC/aws2js)

-------

A simple [Node.js](http://github.com/ry/node) library to communicate with the Amazon Web Services API.

This version of aws-lib requires Node v0.4! You can use v0.0.4 if you need to stick to Node v2.6.

It includes clients for the following services:

   * EC2
   * Product Advertising API
   * SimpleDB
   * SQS (Simple Queue Service)
   * SNS (Simple Notification Service)
   * SES (Simple Email Service)
   * ELB (Elastic Load Balancing Service) - added by [Bernhard Weißhuhn](https://github.com/bkw)

Richard Rodger maintains a user-friendly [SimpleDB library](http://github.com/rjrodger/simpledb) which is based on aws-lib.

aws-lib is designed to be easily extensible. If you want to add your own API client, have a look at ec2.js or simpledb.js and simply follow their example.

### Usage

The following snippet implements an ec2 client and makes a call to DescribeInstances

    var aws = require("aws-lib");

    var ec2 = aws.EC2Client({
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID
    });

    ec2.describeInstances({}, function(err, result) {
      console.dir(result);
    })

Which returns a JSON response similar to:

    [...]
    {"item":{
      "instanceId":"i-acb2d1db","imageId":"ami-03765c77",
      "instanceState": {"code":"80","name":"stopped"},
      "privateDnsName":{},"dnsName":{},
      "reason":"User initiated (2010-07-28 19:37:54 GMT)"
    [...] 

Another example, using Product Advertising API:

    prodAdv = aws.createProdAdvClient(yourAccessKeyId, yourSecretAccessKey, yourAssociateTag);

    prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(result) {
      console.log(JSON.stringify(result));
    })

Will return a long list of books.

Most clients, such as ec2, ses, simpledb, etc. accept an optional third parameter `options` which should be an object of options used to instantiate the client.  For example, the ec2 client could be instantiated with an options object like:

    ec2 = aws.createEC2Client(yourAccessKeyId, yourSecretAccessKey, {version: '2010-08-31'});
    
which would instantiate the ec2 client, but using the 2010-08-31 API version.  See the library code for each service to learn about other possible options.
