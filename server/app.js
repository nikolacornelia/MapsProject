require('express-async-errors');
let multer = require('multer');
let express = require('express');
let http = require('http');
let path = require('path');
let mongoose = require('mongoose');
let fs = require('fs');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let Schema = require('./schema_model');
let oSchema = Schema.sPointOfInterest();
let jQuery = require('jQuery');
let assert = require('assert');
let dbMongo;
const {ObjectID} = require("mongodb");
let mongodb = require("mongodb");
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let gfs;
let bcrypt = require('bcrypt');
let async = require('async');
let request = require('request');
let thenquest = require('then-request');


let schemaPoint = new mongoose.Schema({
    name: String, description: String, category: String, latitude: Number, longitude: Number
});
let Point = mongoose.model("Point", schemaPoint);


let schemaRoute = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    points: [{lat: Number, lng: Number}],
    highlights: [Number],
    location: String
});
//let schemaRoute = new mongoose.Schema({title: String, description: String, difficulty: String});
let Route = mongoose.model("Route", schemaRoute);


//User 
let schemaUser = new mongoose.Schema({
    email: {type: String, unique: true}, username: String, password: String
});
let User = mongoose.model("User", schemaUser);

// Comment
let schemaComment = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
    comment: String
})
let Comment = mongoose.model("Comment", schemaComment);

//Rating
let schemaRating = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
    rating: Number,
})
let Rating = mongoose.model("Rating", schemaRating);

app.use(bodyParser());
app.use(methodOverride());

app.use('/', express.static(`${__dirname}/public/html`));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//connect for image upload (Grid creation)
let conn = mongoose.createConnection('mongodb://localhost:27017/maps');
conn.once('open', function () {
    console.log('connected and created Grid for image upload');
    gfs = new Grid(conn.db);
});


mongoose.connect('mongodb://localhost:27017/maps', function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established');
        }
    }
);
mongoose.connection.once('open', function () {
    console.log('connected');
});


app.post('/savePoint', function (req, res) {
    console.log(req.body.point);
    let aResult = req.body.point;
    aResult = JSON.parse(aResult);
    let myData = new Point(aResult);
    // myData =new Point({ name: "NameNew", description: "DescriptionNew", category: "CategoryNew", latitude: 4534, longitude: 2565});
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

app.post('/saveRoute', function (req, res, next) {
    let oRoute = req.body;
    let url = "https://eu1.locationiq.com/v1/reverse.php?key=267f953f1517c5&lat=" + req.body.points[0].lat + "&lon=" + req.body.points[0].lng + "&format=json";
    request({
        url: url,
        method: 'GET'
    }, function (err, res, body) {
        if (err) throw err;
        res.body = JSON.parse(res.body);
        console.log(res.body.address);
        console.log("Stadt");
        if (res.body.address.city != undefined) {
            console.log(res.body.address.city);
            oRoute.location = res.body.address.city;
        }
        else {
            console.log(res.body.address.town);
            oRoute.location = res.body.address.town;
        }
        req.oRoute = oRoute;
        next();
    });
}, function (req, res) {
    let oData = new Route(req.oRoute);
    oData.save()
        .then(item => {
            console.log('item saved to database');
            res.send("item saved to database");
        })
        .catch(err => {
            console.log('unable to save');
            res.status(400).send("unable to save to database");
        });
});

app.post('/saveRating', function (req, res) {
    req.body.user = "5bf86b725d5d083aea9d6091";
    req.body.route = "5bfd7adf3ef5fe62ebc4d9e3";
    req.body.comment = "Nicht zu empfehlen";
    req.body.rating = 1;

    var oComment = {
        user: req.body.user,
        route: req.body.route,
        comment: req.body.comment
    };
    var oRating = {
        user: req.body.user,
        route: req.body.route,
        rating: req.body.rating,
    }

    let oDataComment = new Comment(oComment);
    oDataComment.save()
        .then(item => {
            console.log('comment');

            Rating.deleteMany({user: req.body.user, route: req.body.route}, function (err) {
                if (err) throw err;
            });

            let oDataRating = new Rating(oRating);
            oDataRating.save()
                .then(item => {
                    console.log('rating saved to database');
                })
            res.send("items saved to database");
        }).catch(err => {
        console.log('unable to save');
        res.status(400).send("unable to save to database");
    });

});


app.get('/getData', function (req, res) {
    Point.find({}, function (err, data) {
        if (err)
            throw err;
        res.send(data);
    });
});

app.get('/getRatings', function (req, res) {
    /** var paramLength = req.body.length;
     if (paramLength!=''){
        param.length = paramLength;
    } **/
});

app.get('/getComments', function (req, res) {


});

app.get('/getRoutes', function (req, res, next) {
        let paramText = req.query.search;
        let paramDifficulty = req.query.difficulty;
        let routeQuery;
        
        if (paramText == '' && paramDifficulty == undefined) {
            routeQuery = {};
        }
        else {
            routeQuery = {$and: []};
            if (paramText != '') {
                routeQuery.$and.push({
                    $or: [{title: {$regex: paramText, $options: "i"}}, {
                        description: {
                            $regex: paramText,
                            $options: "i"
                        }
                    }, {location: {$regex: paramText, $options: "i"}}]
                });
            }

            //difficulty kann mehrer Filter enthalten --> Array
            console.log(paramDifficulty);
            if (paramDifficulty != undefined) {
                if (paramDifficulty.length == 1) {
                    routeQuery.$and.push({difficulty: paramDifficulty[0]});
                } else {
                    let difficultyParam = {$or: []};
                    for (let i = 0; i < paramDifficulty.length; i++) {
                        console.log("FOR");
                        console.log(paramDifficulty[i]);
                        difficultyParam.$or.push({difficulty: paramDifficulty[i]});
                    }
                    routeQuery.$and.push(difficultyParam);
                }
            }
        }
        ;
        Route.find(routeQuery).lean().exec(function (err, data) {
            if (err)
                throw err;
            //no route was found for query
            if (data.length === 0) {
                res.send(data);
            }
            req.routes = data;
            next();
        });
    }
    ,

    function (req, res, next) {
        let aRoutes = req.routes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aRoutes) {
            Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = undefined;
                } else {
                    let avgRating = response[0].rating;
                    oneRoute.avg_rating = avgRating;
                }
                oRoutes.push(oneRoute);
                iFinishedQueries++;
                if (iFinishedQueries === (aRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            });
        }
    }

    ,

    function (req, res) {
        res.send(req.oRoutes);
    }
);


app.get('/getLocalPoints', function (req, res) {
    let oBorder = req.query.border;

    let dMinLat = Number(oBorder.dMinLat);
    let dMaxLat = Number(oBorder.dMaxLat);
    let dMinLong = Number(oBorder.dMinLong);
    let dMaxLong = Number(oBorder.dMaxLong);

    Point.find({latitude: {$gt: dMinLat, $lt: dMaxLat}}, function (err, data) {
        if (err) {
            throw err;
        }
        res.send(data);
    });

});

app.post('/saveDocument', function (req, res) {

    let oObject = req.body.object;
    oObject = 'test.jpg';
    let source = fs.createReadStream(oObject);
    let target = gfs.createWriteStream({
        filename: 'test.jpg',
        reference: '12345'
    });
    source.pipe(target);
});

app.get('/getDocument', function (req, res) {
    //important: there must be only one file with this filename, otherwise no photo gets displayed
    let filename = 'test.jpg';
    gfs.exist({filename: filename}, (err, file) => {
        if (err || !file) {
            res.status(404).send('File not Found');
            return
        }
        let data = [];
        let readstream = gfs.createReadStream({filename: filename});
        readstream.on('data', function (result) {
            data.push(result);
        });
        readstream.on('end', function () {
            data = Buffer.concat(data);
            let img = 'data:image/jpg;base64,' + Buffer(data).toString('base64');
            res.send(img);
        });
        readstream.on('err', function (err) {
            throw err;
        })
    })
});

var BCRYPT_SALT_ROUNDS = 12;
app.post('/register', function (req, res) {
    //let aResult = req.body;
    //aResult = JSON.parse(aResult);
    let myData = new User(req.body);
    bcrypt.hash(myData.password, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword) {
            myData.password = hashedPassword;
            return myData.save();
        })
    /* .then(function () {
        res.send();
    })
    .catch(function (error) {
        console.log("Error saving user: ");
        console.log(error);
        next();
    }); */
});

app.get('/login', function (req, res) {
    let aResult = req.query;
    User.findOne(
        //     {$or: [{email: aResult.email}, {username: aResult.username}]}
        {$or: [{email: aResult.user}, {username: aResult.user}]}
    ).then(function (user) {
        if (!user) {
            console.log("User nicht vorhanden");
        } else {
            bcrypt.compare(req.query.password, user.password, function (err, result) {
                if (result == true) {
                    res.send("Erfolgreich!");
                } else {
                    res.send('Incorrect password');
                }
            });
        }
    });
});

app.listen(3001, function () {
    console.log("Working on port 3001");
});