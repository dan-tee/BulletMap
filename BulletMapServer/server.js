var express = require('express')
  , http = require('http')
  , mongoLib = require('mongodb');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/../Shared'));
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

var server = new mongoLib.Server('localhost', 27017, {auto_reconnect: true});
var client = new mongoLib.MongoClient(server);
client.open(createRoutes);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

function createRoutes(err, client){
    var db = client.db('bullet_map');

    var bulletInfo = require('./bullet_info')(db);
    app.get('/bullet/:id', bulletInfo.findOneBullet);

    var foundShells = require('./found_shells')(db);
    app.get('/found_shells', foundShells.findShellLocations);
    app.post('/found_shell',foundShells.addOneShellLocation);

    //app.get('/bullets', bulletsDb.findAll);
    //app.post('/bullet', bulletsDb.addOneBullet);
}