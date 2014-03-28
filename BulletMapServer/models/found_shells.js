// changing this breaks existing installations. On change update
// the installation guide.
var MODEL_NAME = 'found_shell';
module.exports = function(mongoose, connection, bulletInfoModel, logger){

    var schema = new mongoose.Schema({
        headstamp: { type: String, required: true},
        latitude: { type: Number, required: true, index: true },
        longitude: { type: Number, required: true, index: true },
        uploadDate: { type: Date, required: true, index: true },
        origin: { type: String, required: true, index:true }
    });

    schema.statics.addShellLocation = function(foundShell, res){
        var shellModel = new Model(foundShell);
        if (!shellModel.headstamp){
            logger.error('Post without headstamp.');
            res.send(404, 'Post without headstamp.');
            return;
        }
        shellModel.uploadDate = Date.now();
        bulletInfoModel.findOne( { "_id": shellModel.headstamp } , function(err, bullet_info){
            shellModel.origin = bullet_info.origin;
            shellModel.save(function(err){
                if (err) {
                    logger.error(err);
                    res.send(404, err.message);
                }
                res.send(200);
            });
        })
    };

    // function callback(err, bulletInfo)
    schema.statics.findShellLocations = function(callback){
        Model.aggregate()
             .group({
                "_id": "$origin",
                "locations":{
                    "$push": {
                        "longitude": "$longitude",
                        "latitude": "$latitude"
                    }
                }
             })
             .project({
                "origin": "$_id",
                "locations": 1
             })
             .exec(callback);
    };

    var Model = connection.model(MODEL_NAME, schema);
    return Model;
};