var foundShellsCollection = 'found_shells';

module.exports = function(db){
    var found_shells = {};
    found_shells.findShellLocations = function (req, res) {
        db.collection(foundShellsCollection, function (err, collection) {
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

    found_shells.addOneShellLocation = function (req, res) {
        var shell = req.body;

        db.collection(foundShellsCollection, function (err, collection) {

            collection.insert(shell, true, function (err, collection) {
                collection.msg = 'success';
                res.send(collection);

            });
        });
    };

    return found_shells;
};