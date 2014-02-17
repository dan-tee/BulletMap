/**
 * Created by aselims on 1/14/14.
 #hack4Good Selim
 */

var express = require('express'),

    http = require('http'),
    bulletsdb = require('./routes/bulletsdb');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/../Shared'));
});

//app.get('/bullets', bulletsdb.findAll);
app.post('/bullet', bulletsdb.addOnebullet);
app.get('/bullet/:id', bulletsdb.findOnebullet);
app.get('/found_shells', bulletsdb.findShellLocations);
//app.post('/found_shell',bulletsdb.addOneShellLocation);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
