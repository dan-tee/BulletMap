/**
 * Created by aselims on 1/14/14.
 #hack4Good Selim
 */

var DbName = 'bulletsDb';
var bulletInfoCollection = 'bullets';
var foudShellsCollection = 'found_shells';

var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017, {auto_reconnect: true});
var newDb = new mongo.Db(DbName, server);
var db;
newDb.open(function(err, openDb){
    db = openDb;
});

function checkDb(){
    if (!db){
        throw new Error("DB hasn't been opened yet.");
    }
}

exports.findAll = function (req, res) {
    checkDb();
    db.collection(bulletInfoCollection, function (err, collection) {
        collection.find().toArray(function (err, items) {
            res.send(items);
        });
    });
};

exports.findOnebullet = function (req, res) {
    checkDb();
    var id = req.params.id;
    db.collection(bulletInfoCollection, function (err, collection) {
        console.log('Looking for item with id ' + id)
        collection.findOne({'headstamp': id}, function (err, item) {
            console.log('Item with id ' + id + ' found.')
            res.send(item);
        });
    });
};

exports.addOnebullet = function (req, res) {
    checkDb();
    var bullet = req.body;

    db.collection(bulletInfoCollection, function (err, collection) {

        collection.insert(bullet, true, function (err, collection) {
            collection.msg = 'success'
            res.send(collection);

        });
    });
};

exports.findShellLocations = function (req, res) {
    checkDb();
    db.collection(foudShellsCollection, function (err, collection) {
        collection.aggregate([
            { $group: {_id: "$Origin", "Locations": {"$push": {"Longitude": "$longitude", "Latitude": "$latitude"}}}},
            { $project: {"Origin": "$_id", "Locations": "$Locations"}}
        ], function(err, items) {
            //console.log(result);
            res.send(items);
            //db.close();
        });
        /*
         .aggregate([{$group: {_id:"$Origin", "Locations":{"$push":{"Longitude":"$longitude","Latitude":"$latitude"}}}},{$project: {"Origin" : "$_id", "Locations":"$Locations"}}])
         collection.find().toArray(function(err, items) {
         res.send(items);
         });
         */
    });
};

exports.addOneShellLocation = function (req, res) {
    checkDb();
    var shell = req.body;

    db.collection(foudShellsCollection, function (err, collection) {

        collection.insert(shell, true, function (err, collection) {
            collection.msg = 'success'
            res.send(collection);

        });
    });
};
