// changing this breaks existing installations. On change update
// the installation guide.
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , config = require('./config.json')
  , winston = require('winston');

winston.handleExceptions(new winston.transports.Console);
var logger = new winston.Logger({
    transports: [new (winston.transports.Console)({ level: config.logLevel })]
});

var app = require('./express_config')(express, config.port);
var connect = require('./mongoose_config');
connect(mongoose, function(cnn){

    require('./routes')(app, mongoose, cnn, logger, purgeCache);

    http.createServer(app).listen(config.port, function () {
        logger.info("Express server listening on port " + config.port);
    });
});

// Gandi is using a varnish cache. we need to purge it,
// not to delays the showing of new findings
function purgeCache(){
    var options = {
        host: 'localhost',
        path: '/found_shells',
        method: 'PURGE'
    };

    http.request(options);
}

