// changing this breaks existing installations. On change update
// the installation guide.
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose')
  , config = require('./config.json')
  , winston = require('winston');

//winston.handleExceptions(new winston.transports.Console);
var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            level: config.logLevel,
            timestamp: true
        })
    ]
});

var app = require('./express_config')(express, config);
var connect = require('./mongoose_config');
connect(mongoose, function(cnn){

    require('./routes')(app, mongoose, cnn, logger);

    http.createServer(app).listen(app.get('port'), function () {
        logger.info("Express server listening on port " + app.get('port'));
    });
});

