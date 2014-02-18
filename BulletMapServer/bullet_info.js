var bulletInfoCollection = 'bullets';

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

    return bulletsDb;
};