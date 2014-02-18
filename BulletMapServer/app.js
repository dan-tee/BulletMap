var express = require('express')
  , http = require('http')
  , mongoLib = require('mongodb');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/../Shared'));
});

var server = new mongoLib.Server('localhost', 27017, {auto_reconnect: true});
var client = new mongoLib.MongoClient(server);
client.open(function(err, client){
    var db = client.db('bulletsDb');
    var bulletsDb = require('./found_shells/bulletsdb')(db);

    app.get('/bullet/:id', bulletsDb.findOnebullet);
    app.get('/found_shells', bulletsDb.findShellLocations);
    app.post('/found_shell',bulletsDb.addOneShellLocation);

    //app.get('/bullets', bulletsDb.findAll);
    //app.post('/bullet', bulletsDb.addOnebullet);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
