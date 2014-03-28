module.exports = function configure_express(express, config) {
    var app = express();
    app.configure(function () {
        app.set('port', config.port);

        // use bodyParse() to enable file uploads
        // see https://groups.google.com/forum/#!msg/express-js/iP2VyhkypHo/5AXQiYN3RPcJ
        // app.use(express.bodyParser());
        app.use(express.json());
        app.use(express.urlencoded());

        app.use(express.static(__dirname + '/' + config.sharedPath));
    });
    app.all('*', function (req, res, next) {
        if (config.allowCrossOriginRequests)
            // should only be activated for debugging
            res.header("Access-Control-Allow-Origin", "*");
        next();
    });
    return app;
};