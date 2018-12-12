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
let jQuery = require('jQuery');
let assert = require('assert');
let dbMongo;
const { ObjectID } = require("mongodb");
let mongodb = require("mongodb");
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let gfs;
let bcrypt = require('bcrypt');
let async = require('async');
let request = require('request');
let thenquest = require('then-request');
let sortJson = require('sort-json-array');
//let Buffer = require('buffer/').Buffer;
var cors = require('cors');
let session = require('express-session');
let Binary = require('mongodb').Binary;
let round = require('math-round');
let lodash = require('lodash.sortby');
let _ = require('underscore');

/**
 let schemaImage = new mongoose.Schema({
    created: {type: Date, default: Date.now}, imageData: String, imageType: String
});
 let Image = mongoose.model('Image', schemaImage);

 let schemaPoint = new mongoose.Schema({
    name: String, description: String, category: String, latitude: Number, longitude: Number
});
 let Point = mongoose.model("Point", schemaPoint);

 //User
 let schemaUser = new mongoose.Schema({
    email: {type: String, unique: true}, username: String, password: String
});
 let User = mongoose.model("User", schemaUser);

 //ROUTE
 let schemaRoute = new mongoose.Schema({
    title: String,
    description: String,
    difficulty: String,
    points: [{lat: Number, lng: Number}],
    highlights: [Number],
    distance: [Number],
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
 let schemaRating = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
    comment: String,
    image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'},
    rating: Number,
})
 let Rating = mongoose.model("Rating", schemaRating);

 //Favourites
 let schemaFavs = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    route: {type: mongoose.Schema.Types.ObjectId, ref: 'Route'},
    created: {type: Date, default: Date.now},
})
 let Favourite = mongoose.model("Favourite", schemaFavs); **/

//app.use(bodyParser());
app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(methodOverride());

app.use('/', express.static(`${__dirname}/public/html`));

app.use(function (req, res, next) {
    // allow cors for dev/testing purposes
    res.header("Access-Control-Allow-Origin", req.get("origin"));
    res.header("Access-Control-Allow-Credentials", true);
    let headers = [
        "authorization", "withcredentials", "x-requested-with", "x-forwarded-for", "x-real-ip", "x-customheader",
        "user-agent", "keep-alive", "host", "accept", "connection", "upgrade", "content-type", "dnt", "if-modified-since", "cache-control"
    ];
    res.header("Access-Control-Allow-Headers", headers.join(','));
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Max-Age", 0);

    // browser caches the request (e.g. getRoutes) if these headers aren't set
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

var auth = function (req, res, next) {
    if (req.session && req.session.userid) {
        return next();
    } else {
        return res.sendStatus(401);
    }
};
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

app.post('/favoriseRoute', auth, function (req, res) {
    let oFavourite = {};
    oFavourite.route = req.body.route;
    oFavourite.user = req.session.userid;

    if (req.body.isFavorised == false) {
        //todo at the moment
        Schema.Favourite.deleteMany(oFavourite, function (err) {
            if (err) throw (err);
            console.log('deleted successful');
            res.status(200).send();
        });

    } else {
        let myData = new Schema.Favourite(oFavourite);
        myData.save()
            .then(item => {
                console.log('savedElement');
                res.send(item);
            })
            .catch(err => {
                res.status(400).send("unable to save favourized route to database");
            });
    }
});

app.post('/savePoint', auth, function (req, res) {
    console.log(req.body.data.point);
    let aResult = req.body.data.point;
    aResult = JSON.parse(aResult);
    let myData = new Schema.Point(aResult);
    // myData =new Point({ name: "NameNew", description: "DescriptionNew", category: "CategoryNew", latitude: 4534, longitude: 2565});
    myData.save()
        .then(item => {
            res.send("point saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save point to database");
        });
});

app.delete('/Route', auth, function (req, res) {
    //todo delete dependencies
    Schema.Route.findOneAndDelete(req.query, function (err, data) {
        if (err) {
            res.status(404).send("unable to delete route to database");
            throw err;
        }
        res.send('deleted Route');
        console.log('successfully deleted Route');
    });
});

app.delete('/LikedRoute', auth, function (req, res) {
    console.log('inseide liked route');
    console.log(req.query._id);
    let query = {};
    query.route = req.query._id;
    query.user = req.query.user;
    console.log("QUERY");
    console.log(query);
    Schema.Favourite.findOneAndDelete(query, function (err, data) {
        if (err) {
            res.status(404).send("unable to delete like of user for a route ");
            throw err;
        }
        res.send('deleted Fav for Route');
        console.log('successfully deleted Fav for Route');
    });
});


app.post('/saveRoute', auth, function (req, res, next) {

    let oRoute = req.body;
    //todo round distance
    console.log(oRoute);
    // oRoute.distance = round(oRoute.distance,1);
    //console.log(oRoute.distance);
    let url = "https://eu1.locationiq.com/v1/reverse.php?key=267f953f1517c5&lat=" + req.body.points[0].lat + "&lon=" + req.body.points[0].lng + "&format=json";
    request({
        url: url,
        method: 'GET'
    }, function (err, res, body) {
        if (err) {
            res.status(404).send("unable to get start location for route");
            throw err;
        }
        res.body = JSON.parse(res.body);

        try {
            if (res.body.address.city != undefined) {
                console.log(res.body.address.city);
                oRoute.location = res.body.address.city;

            }
            else if (res.body.address.town != undefined) {
                console.log(res.body.address.town);
                oRoute.location = res.body.address.town;
            }
            else if (res.body.address.village != undefined) {
                console.log(res.body.address.village);
                oRoute.location = res.body.address.village;
            }
        }
        catch (e) {
            console.log("access location failed");
        }

        if (req.body.images != undefined) {
            let oImage = new Schema.Image();
            oImage.imageData = req.body.images;
            oImage.save()
                .then(item => {
                    console.log('image saved to database');
                    oRoute.image = item._id;
                    req.oRoute = oRoute;
                    next();
                })
                .catch(err => {
                    res.status(400).send("unable to save image to database");
                });
        } else {
            //no image was sent
            oRoute.image = null;
            req.oRoute = oRoute;
            next();
        }
    });
},

    function (req, res) {
        let oData = new Schema.Route(req.oRoute);
        console.log("req.oROute");
        console.log(req.oRoute);
        oData.save()
            .then(item => {
                console.log('route saved to database');
                res.send("route saved to database");
            })
            .catch(err => {
                console.log('unable to save');
                res.status(400).send("unable to save route to database");
            });
    });

app.post('/saveRating', auth, function (req, res, next) {
    if (req.body.route == undefined || req.body.user == undefined) {
        console.log("route or user is null");
        res.status(400).send("error while saving rating because route/user is undefined");
        return;
    }
    if (req.body.image != undefined) {
        let oImage = new Schema.Image();
        oImage.imageData = req.body.image;
        oImage.save()
            .then(item => {
                console.log('image saved to database');
                req.body.image = item._id;
                next();
            })
            .catch(err => {
                console.log('unable to save image');
                res.status(400).send("unable to save image");
            })
    } else {
        next();
    }

}, function (req, res) {

    Schema.Rating.deleteMany({ user: req.body.user, route: req.body.route })
        .then(item => {
            console.log('deleted items');
            let oDataRating = new Schema.Rating(req.body);
            oDataRating.save()
                .then(item => {
                    console.log('comment');
                    res.send('success saving new rating');
                }).catch(err => {
                    console.log('unable to save');
                    res.status(400).send("unable to save rating to database");
                });

        }).catch(err => {
            console.log('unable to delete');
            res.status(400).send("unable to delete old comment in database");
        });

});


app.get('/getData', function (req, res) {
    Schema.Point.find({}, function (err, data) {
        if (err) {
            res.status(404).send("unable to get data for points");
            throw err;
        }
        res.send(data);
    });
});


app.get('/getRatings', function (req, res) {
    Schema.Rating.find({ route: req.query.route }).populate('user').exec(function (err, data) {
        if (err) {
            res.status(404).send("unable to get ratings");
            throw err;
        }
        // don't send password to FrontEnd
        data.forEach(function (element) {
            element.user.password = null;
        });
        res.send(data);
    });
});

app.get('/getRoutes', function (req, res, next) {

    let paramText = req.query.search;
    let paramDifficulty = req.query.difficulty;
    let paramDistance = req.query.distance;
    let routeQuery;

    if (paramText === '' && paramDifficulty === undefined && req.query.features === undefined) {
        routeQuery = { distance: { $lt: paramDistance } };
    }
    else {
        routeQuery = { $and: [] };
        if (paramText != '') {
            routeQuery.$and.push({
                $or: [{ title: { $regex: paramText, $options: "i" } }, {
                    description: {
                        $regex: paramText,
                        $options: "i"
                    }
                }, { location: { $regex: paramText, $options: "i" } }]
            });
        }
        //difficulty can contain multiple parameters  => Array
        if (paramDifficulty != undefined) {
            if (paramDifficulty.length == 1) {
                routeQuery.$and.push({ difficulty: paramDifficulty[0] });
            } else {
                let difficultyParam = { $or: [] };
                for (let i = 0; i < paramDifficulty.length; i++) {
                    console.log("FOR");
                    console.log(paramDifficulty[i]);
                    difficultyParam.$or.push({ difficulty: paramDifficulty[i] });
                }
                console.log(difficultyParam);
                routeQuery.$and.push(difficultyParam);
            }
        }

        if (req.query.features != undefined) {
            routeQuery.$and.push({ features: { $all: req.query.features } });
        }
        routeQuery.$and.push({ distance: { $lt: req.query.distance } });
    }
    ;

    Schema.Route.find(routeQuery).lean().then(function (data) {
        //no route was found for query
        if (data.length === 0) {
            res.send(data);
        }
        req.routes = data;
        next();
    }).catch(function (error) {
        console.log("Error while finding route ");
        res.status(404).send("unable to find route");

    });
    ;
}
    ,

    function (req, res, next) {
        let aRoutes = req.routes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aRoutes) {
            Schema.Rating.aggregate([{ $match: { route: aRoutes[i]._id } }
                , { $group: { _id: null, rating: { $avg: '$rating' } } }
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    //zero if undefined
                    oneRoute.avg_rating = 0;
                } else {
                    let avgRating = response[0].rating;
                    oneRoute.avg_rating = avgRating;
                }
                //oneRoute.created = Date(oneRoute.created);
                oRoutes.push(oneRoute);
                iFinishedQueries++;
                if (iFinishedQueries === (aRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            }).catch(function (error) {
                console.log("Error while accessing rating");
                res.status(400).send("error while accessing rating");

            });
            ;
        }
    },
    function (req, res, next) {
        let oRoutes = [];
        let iFinishedQueries = 0;
        for (let i in req.oRoutes) {
            Schema.Favourite.findOne({ $and: [{ route: req.oRoutes[i]._id }, { user: req.session.userid }] }, function (err, obj) {
                if (err) {
                    res.status(404).send("unable to find favourites");
                    throw err;
                }
                let oneFav = req.oRoutes[i];
                //if no search result ->  route isn't favorised
                if (obj === null) {
                    oneFav.isFavorised = false;
                } else {
                    oneFav.isFavorised = true;
                }
                oRoutes.push(oneFav);
                iFinishedQueries++;
                if (iFinishedQueries === (req.oRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            });
        }
        ;
    },
    function (req, res) {
    let aResult = sortRoutes(req.oRoutes, req.query.sortBy);

        res.send(aResult);
    }
);


app.get('/getLocalPoints', function (req, res) {
    Schema.Point.find({}, function (err, data) {
        if (err) {
            res.status(404).send("unable to get points");
            throw err;
        }
        res.send(data);
    });

});

/**
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
}); **/

var BCRYPT_SALT_ROUNDS = 12;
app.post('/register', function (req, res) {
    //let aResult = req.body;
    //aResult = JSON.parse(aResult);
    // todo: check if user already exists
    // todo: check if password length > 8
    // todo: check if email is syntactically correct
    let myData = new Schema.User(req.body);
    bcrypt.hash(myData.password, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword) {
            myData.password = hashedPassword;
            return myData.save();
        })
        .then(function () {
            res.send();
        })
        .catch(function (error) {
            console.log("Error saving user ");
            res.status(400).send("error saving user");
        });
});

app.get('/login', function (req, res) {
    let aResult = req.query;
    Schema.User.findOne(
        { $or: [{ email: aResult.user }, { username: aResult.user }] }
    ).then(function (user) {
        if (!user) {
            console.log("User nicht vorhanden");
            res.sendStatus(500);
        } else {
            bcrypt.compare(req.query.password, user.password, function (err, result) {
                if (result == true) {
                    req.session.userid = user._id;
                    res.send(user);
                } else {
                    res.sendStatus(500);
                }
            });
        }
    }).catch(function (error) {
        console.log("Error getting user ");
        res.status(404).send("error while finding users");
    });
});

app.get('/logout', function (req, res) {
    if (req.session)
        req.session.destroy();
    res.send(200);
});

app.get('/Image', function (req, res, next) {
    console.log('getMyRoutes');
    let routeQuery = {};
    routeQuery.user = req.query.user;
    Schema.Image.findOne({ _id: req.query.id }).lean().exec(function (err, data) {
        console.log(data);
        if (err) {
            console.log('error');
            //res.sendStatus(404).send("error while finding image");
        } else {
            let img = Buffer.from(data.imageData.split(',')[1], 'base64');

            res.header('Content-Type', 'image/jpg');
            res.header('Content-Length', img.length);

            // allow browser caching for Images
            res.header('Cache-Control', 'public, max-age=2592000');
            res.header('Expires', new Date(Date.now() + 2592000000).toUTCString());
            res.header('Pragma', 'no-cache');

            res.end(img);
        }

    })
});


app.get('/getMyRoutes', auth, function (req, res, next) {
    console.log('getMyRoutes');
    let routeQuery = {};
    //routeQuery.user = "5bf86b725d5d083aea9d6090";
    routeQuery.user = req.query.user;
    Schema.Route.find(routeQuery).lean().exec(function (err, data) {
        if (err) {
            res.sendStatus(404).send("error while finding routes");
            throw err;
        }
        req.responseData = data;
        next();
    });
},
    function (req, res, next) {
        let aRoutes = req.responseData;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aRoutes) {
            Schema.Rating.aggregate([{ $match: { route: aRoutes[i]._id } }
                , { $group: { _id: null, rating: { $avg: '$rating' } } }
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = undefined;
                } else {
                    let avgRating = response[0].rating;
                    oneRoute.avg_rating = avgRating;
                }
                if (oneRoute.distance > 0)
                    oneRoute.distance = Math.round(oneRoute.distance * 100) / 100;
                oRoutes.push(oneRoute);
                iFinishedQueries++;
                if (iFinishedQueries === (aRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            }).catch(function (error) {
                console.log("Error while aggregating rating");
                res.status(400).send("error while aggregating rating");
            });
        }
    }
    ,
    function (req, res) {
        if (req.oRoutes.length == 0) {
            res.send([]);
        } else {
            let aResult = sortRoutes(req.oRoutes, req.query.sortBy);
            res.send(aResult);
        }
    }
)
    ;

app.get('/getMyLikedRoutes', auth, function (req, res, next) {
    console.log('getMyLikedRoutes');
    let routeQuery = {};
    //routeQuery.user = user;
    routeQuery.user = req.query.user;
    console.log(routeQuery.user);
    Schema.Favourite.find(routeQuery).exec(function (err, data) {
        if (err) {
            res.status(404).send("error while finding favourite");
            throw err;
        }
        req.fav = data;
        if (data.length == 0) {
            res.send(data);
        }
        next();
    })

},
    function (req, res, next) {
        let aFavRoutes = req.fav;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aFavRoutes) {
            console.log(aFavRoutes[i].route);
            Schema.Route.findOne({ _id: aFavRoutes[i].route }).lean().exec(function (err, data) {
                if (err) {
                    res.status(404).send("error while finding route");
                    throw err;
                }
                if (data.distance > 0)
                    data.distance = Math.round(data.distance * 100) / 100;
                if (data != null) {
                    oRoutes.push(data);
                }
                iFinishedQueries++;
                if (iFinishedQueries === (aFavRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            });
        }
        ;

    }
    ,
    function (req, res, next) {
        let aRoutes = req.oRoutes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aRoutes) {
            Schema.Rating.aggregate([{ $match: { route: aRoutes[i]._id } }
                , { $group: { _id: null, rating: { $avg: '$rating' } } }
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
                    req.favRoutes = oRoutes;
                    next();
                }
            }).catch(function (error) {
                console.log("Error while aggregating rating");
                res.status(400).send("error while aggregating rating");
            });
        }
    },
    function (req, res) {
        if (req.favRoutes.length == 0) {
            res.send([]);
        } else {
            let aResult = sortRoutes(req.favRoutes, req.query.sortBy);
            res.send(aResult);
        }
    }
)
    ;

app.get('/reviewedRoutes', function (req, res, next) {
    console.log('getMyReviewedRoutes');
    let routeQuery = {};
    routeQuery.user = req.query.user;
    console.log(routeQuery.user);
    Schema.Rating.find(routeQuery).lean().populate('user').exec(function (err, data) {
        if (err) {
            console.log("Error while finding rating");
            res.status(404).send("error while finding rating");
            throw err;
        }
        ;

        console.log(data.user);
        data.forEach(function (data) {
            data.user.password = null;
        });
        req.comment = data;
        if (data.length == 0) {
            console.log("DATA1");
            console.log(data);

            res.send(data);
        }
        next();
    })
},
    function (req, res, next) {
        let aCommentedRoutes = req.comment;
        console.log("ACOmmentedROutes");
        console.log(aCommentedRoutes);
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aCommentedRoutes) {
            console.log(aCommentedRoutes[i].route);

            Schema.Route.findOne({ _id: aCommentedRoutes[i].route }).lean().exec(function (err, data) {
                if (err) {
                    console.log("Error while finding route");
                    res.status(404).send("error while finding route");
                }

                if (data != null) {
                    data.comments = req.comment;
                    oRoutes.push(data);
                }
                if (data.distance > 0)
                    data.distance = Math.round(data.distance * 100) / 100;
                iFinishedQueries++;
                if (iFinishedQueries === (aCommentedRoutes.length)) {
                    console.log("OROUTES");
                    console.log(oRoutes);
                    req.oRoutes = oRoutes;
                    next();
                }


            })/* .catch(function (error) {
                console.log("Error while finding route");
                res.status(404).send("error while finding route");
            }); */
        }
        ;

    }
    ,
    function (req, res, next) {
        let aRoutes = req.oRoutes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;
        for (let i in aRoutes) {
            Schema.Rating.aggregate([{ $match: { route: aRoutes[i]._id } }
                , { $group: { _id: null, rating: { $avg: '$rating' } } }
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                console.log("oneRoute");
                console.log(oneRoute);
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = undefined;
                } else {
                    let avgRating = response[0].rating;
                    oneRoute.avg_rating = avgRating;
                }
                console.log(oRoutes);
                oRoutes.push(oneRoute);
                iFinishedQueries++;
                if (iFinishedQueries === (aRoutes.length)) {
                    console.log("finishedwure");
                    console.log(oRoutes.length);
                    req.favRoutes = oRoutes;
                    next();
                }
            }).catch(function (error) {
                console.log("Error while finding rating");
                res.status(404).send("error while finding rating");
            });
        }
    },
    function (req, res) {
        if (req.favRoutes.length == 0) {
            res.send([]);
        } else {
            let aResult = sortRoutes(req.favRoutes, req.query.sortBy);
            res.send(aResult);
        }
    }
)
    ;

app.listen(3001, function () {
    console.log("Working on port 3001");
});

app.delete('/Rating', auth, function (req, res) {
    Schema.Rating.findOneAndDelete({ _id: req.query._id }, function (err, data) {
        if (err) {
            console.log("Error while finding and deleting rating");
            res.status(404).send("error while finding and deleting rating");
            throw err;
        }
        res.send('deleted Rating for Route');
        console.log('successfully deleted Fav for Route');
    });
});

function sortRoutes(aRoutes, iSortBy) {
    if (iSortBy == 1) {
        //Sort by name
        sortJson(aRoutes, 'title', 'asc');
    } else if (iSortBy == 2) {
        //Sort by average rating
        sortJson(aRoutes, 'avg_rating', 'des');
    } else if (iSortBy == 3) {
        aRoutes = sortByDate(aRoutes);
    }
    return aRoutes;
}


function sortByDate(aRoutes) {
    if (aRoutes.length <= 1) {
        return aRoutes;
    } else {
        let left = [];
        let right = [];
        let aResult = [];
        let pivotElement = aRoutes.pop();
        let pivotDate = new Date(pivotElement.created).getTime();
        for (let i = 0; i < aRoutes.length; i++) {
            if (new Date(aRoutes[i].created).getTime() >= pivotDate) {
                left.push(aRoutes[i]);
            } else {
                right.push(aRoutes[i]);
            }
        }
        return aResult.concat(sortByDate(left), pivotElement, sortByDate(right));
    }
}