/**
 * Created by aselims on 1/14/14.
 #hack4Good Selim
 */

var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var DbName = 'bulletsDb';

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(DbName, server, {safe: true});


exports.findAll = function(req, res) {
    db.collection('bullets', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findOnebullet = function(req, res){
    var id = req.params.id;
    db.collection('bullets', function(err, collection){
        collection.findOne({'headstamp':id}, function(err, item) {
            res.send(item);
        });
    });
};

exports.addOnebullet = function(req, res){
    var bullet = req.body;

    db.collection('bullets', function(err, collection) {

        collection.insert(bullet, true, function(err, collection){
            collection.msg = 'success'
            res.send(collection);

        });
    });
};


