// changing this breaks existing installations. On change update
// the installation guide.
var COLLECTION_NAME = 'bullet_info';
module.exports = function(mongoose, connection){
    var schema = new mongoose.Schema({
        // headstamp is used as _id
        _id: { type: String, index: true },
        origin: String,
        comment: String
    }, { collection : COLLECTION_NAME } );

    schema.virtual('headstamp').get(function(){
        return _id;
    });

    schema.virtual('headstamp').get(function(){
        return _id;
    });

    // function callback(err, bulletInfo)
    schema.statics.findByHeadstamp = function(headstamp, callback){
        var caseInsensitive = headstamp.toLowerCase();
        Model.findOne({"_id": caseInsensitive}, callback);
    };

    var Model = connection.model(COLLECTION_NAME, schema);
    return {
        "Model": Model,
        modelName: COLLECTION_NAME
    }
};