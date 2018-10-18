var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = {
    sPointOfInterest: () => {
        var schema = new Schema({
        pointOfInterest: { name: String, description: String, category: String, latitude: Number, longitude: Number}
        });
        let mSchema = mongoose.model('pointOfInterest', schema);
        return mSchema;
    },
    sRoute: () => {
        let schema = new Schema({
        img: { data: Buffer, contentType: String }
        });
            let mSchema = mongoose.model('imageNew', schema);
            return mSchema;
    }
} 