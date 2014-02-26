var bulletInfoCollection = 'bullet_info';

module.exports = function(db){
    var bulletsDb = {};
    bulletsDb.findAll = function (req, res) {
        db.collection(bulletInfoCollection, function (err, collection) {
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        });
    };

    bulletsDb.findOneBullet = function (req, res) {
        var id = req.params.id.toLowerCase();
        db.collection(bulletInfoCollection, function (err, collection) {
            collection.findOne({'headstamp': id}, function (err, item) {
                if (item) res.send(item);
                else {
                    res.status(404);
                    res.send();
                }
            });
        });
    };

    bulletsDb.addOneBullet = function (req, res) {
        var bullet = req.body;

        db.collection(bulletInfoCollection, function (err, collection) {

            collection.insert(bullet, true, function (err, collection) {
                collection.msg = 'success';
                res.send(collection);

            });
        });
    };

    return bulletsDb;
};