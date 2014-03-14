// changing this breaks existing installations. On change update
// the installation guide.
var MODEL_NAME = 'found_shell';
module.exports = function(mongoose, connection, bulletInfoModel){

    var schema = new mongoose.Schema({
        headstamp: String,
        latitude: { type: Number, index: true },
        longitude: { type: Number, index: true },
        uploadDate: { type: Date, index: true },
        origin: { type: String, index:true }
    });

    schema.statics.addShellLocation = function(foundShell){
        var shellModel = new Model(foundShell);
        shellModel.uploadDate = Date.now();
        bulletInfoModel.findOne( { "_id": shellModel.headstamp } , function(err, bullet_info){
            shellModel.origin = bullet_info.origin;
            shellModel.save(function(err){});
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