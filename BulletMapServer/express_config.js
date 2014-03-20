module.exports = function configure_express(express, config) {
    var app = express();
    app.configure(function () {
        app.set('port', config.port);
        app.use(express.bodyParser());
        app.use(express.static(__dirname + '/' + config.sharedPath));
    });
    app.all('*', function (req, res, next) {
        // only here for debugging purposes
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });
    return app;
};