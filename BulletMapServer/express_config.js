module.exports = function configure_express(express) {
    var app = express();
    app.configure(function () {
        app.set('port', process.env.PORT || 3000);
        app.use(express.bodyParser());
        app.use(express.static(__dirname + '/../Shared'));
    });
    app.all('*', function (req, res, next) {
        // only here for debugging purposes
        res.header("Access-Control-Allow-Origin", "*");
        next();
    });
    return app;
};