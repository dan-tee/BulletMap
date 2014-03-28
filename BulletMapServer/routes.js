module.exports = function(app, mongoose, cnn, logger){
    var bulletInfo = require('./models/bullet_info')(mongoose, cnn);
    app.get('/bullet/:headstamp', function (req, res){
        logger.info('GET /bullet/' + req.params.headstamp);
        var headstamp = req.params.headstamp;
        bulletInfo.Model.findByHeadstamp(headstamp, function(err, bulletInfo){
            if (bulletInfo) res.send(bulletInfo);
            else {
                res.send(404);
            }
        });
    });

    var foundShells = require('./models/found_shells')(mongoose, cnn, bulletInfo.Model, logger);
    app.post('/found_shell', function (req, res){
        logger.info('POST /found_shell', req.body);
        var foundShell = req.body;
        foundShells.addShellLocation(foundShell, res);
    });
    app.get('/found_shells', function (req, res){
        logger.info('GET /found_shells');
        foundShells.findShellLocations(function(err, shell_locations){
            res.header('Cache-Control', 'max-age=1, public');
            res.send(shell_locations);
        });
    });
};










