module.exports = function(app, mongoose, cnn){
    var bulletInfo = require('./models/bullet_info')(mongoose, cnn);
    app.get('/bullet/:headstamp', function (req, res){
        var headstamp = req.params.headstamp;
        bulletInfo.Model.findByHeadstamp(headstamp, function(err, bulletInfo){
            if (bulletInfo) res.send(bulletInfo);
            else {
                res.send(404);
            }
        });
    });

    var foundShells = require('./models/found_shells')(mongoose, cnn, bulletInfo.Model);
    app.post('/found_shell', function (req, res){
        var foundShell = req.body;
        foundShells.addShellLocation(foundShell);
        res.send(100);
    });
    app.get('/found_shells', function (req, res){
        foundShells.findShellLocations(function(err, shell_locations){
            res.send(shell_locations);
        });
    });
};










