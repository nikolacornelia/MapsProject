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
        Route: { name: String, description: String, points: Object, marker: Object, poly: Object, highlight: Object}
         });
            let mSchema = mongoose.model('Route', schema);
            return mSchema;
    }
} 