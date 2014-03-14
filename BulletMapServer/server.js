// changing this breaks existing installations. On change update
// the installation guide.
var express = require('express')
  , http = require('http')
  , mongoose = require('mongoose');


var app = require('./express_config')(express);
var connect = require('./mongoose_config');
connect(mongoose, function(cnn){
    require('./routes')(app, mongoose, cnn);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
});

