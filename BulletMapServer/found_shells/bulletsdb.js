var bulletInfoCollection = 'bullets';
var foudShellsCollection = 'found_shells';

module.exports = function(db){
    var bulletsDb = {};
    bulletsDb.findAll = function (req, res) {
        db.collection(bulletInfoCollection, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    bulletsDb.findOnebullet = function (req, res) {
        var id = req.params.id;
        db.collection(bulletInfoCollection, function (err, collection) {
            collection.findOne({'headstamp': id}, function (err, item) {
                res.send(item);
            });
        });
    };

    bulletsDb.addOnebullet = function (req, res) {
        var bullet = req.body;

        db.collection(bulletInfoCollection, function (err, collection) {

            collection.insert(bullet, true, function (err, collection) {
                collection.msg = 'success'
                res.send(collection);

            });
        });
    };

    bulletsDb.findShellLocations = function (req, res) {
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

    bulletsDb.addOneShellLocation = function (req, res) {
        var shell = req.body;

        db.collection(foudShellsCollection, function (err, collection) {

            collection.insert(shell, true, function (err, collection) {
                collection.msg = 'success'
                res.send(collection);

            });
        });
    };

    return bulletsDb;
};