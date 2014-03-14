var DB_NAME = 'bullet_map';

// function cnn_open_callback(cnn)
module.exports = function(mongoose, cnn_open_callback){
    var options = {server: {}, replset: {}};
    options.server.socketOptions = { keepAlive: 1 };
    options.replset.socketOptions = { keepAlive: 1 };

    mongoose.connect('mongodb://localhost/' + DB_NAME, options);
    var cnn = mongoose.connection;
    cnn.on('error', console.error.bind(console, 'connection error:'));
    cnn.once('open', function(){
        cnn_open_callback(cnn);
    });
};