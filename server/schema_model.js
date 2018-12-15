let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let schemaImage = new Schema({
    created: {type: Date, default: Date.now}, imageData: String, imageType: String
});
let Image = mongoose.model('Image', schemaImage);

let schemaPoint = new Schema({
    name: String, description: String, category: String, latitude: Number, longitude: Number
});
let Point = mongoose.model("Point", schemaPoint);

//User
let schemaUser = new Schema({
    email: {type: String, unique: true}, username: String, password: String
});
let User = mongoose.model("User", schemaUser);

//ROUTE
let schemaRoute = new Schema({
    title: String,
    description: String,
    difficulty: String,
    points: [{lat: Number, lng: Number}],
    highlights: [Number],
    distance: Number,
    location: String,
    created: {type: Date, default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    features: [String],
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'}
    //image: Buffer
});
//let schemaRoute = new mongoose.Schema({title: String, description: String, difficulty: String});
let Route = mongoose.model("Route", schemaRoute);

//Rating
let schemaRating = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
    comment: String,
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
    rating: Number,
})
let Rating = mongoose.model("Rating", schemaRating);

//Favourites
let schemaFavs = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
})
let Favourite = mongoose.model("Favourite", schemaFavs);



module.exports = {
    Image,Point, User, Route, Rating, Favourite
};