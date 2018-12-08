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
let sortJson = require('sort-json-array');
let user = "5bf86b725d5d083aea9d6090";
//let Buffer = require('buffer/').Buffer;
var cors = require('cors');
let session = require('express-session');
let Binary = require('mongodb').Binary;


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
let Favourite = mongoose.model("Favourite", schemaFavs);

//app.use(bodyParser());
app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(methodOverride());
app.use(cors());

app.use('/', express.static(`${__dirname}/public/html`));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

var auth = function (req, res, next) {
    if (req.session)
        return next();
    else
        return res.sendStatus(401);
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

app.post('/favoriseRoute', function (req, res) {
    let oFavourite = {};
    console.log("FAVORISE ROUTE");
    console.log(req.body);
    oFavourite.route = req.body.route; // todo: use req.session.user instead
    //oFavourite.route = "5bfd7adf3ef5fe62ebc4d9e3";
    oFavourite.user = req.body.user;
    console.log("ISFAVORISED");
    console.log(req.body.isFavorised);

    if (req.body.isFavorised == false) {
        //todo at the moment
        Favourite.deleteMany(oFavourite, function (err) {
            if (err) throw (err);
            console.log('deleted successfull');
        });

    } else {
        let myData = new Favourite(oFavourite);
        myData.save()
            .then(item => {
                console.log('savedElement');
                res.send(item);
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
    }
});

app.post('/savePoint', function (req, res) {
    console.log(req.body.data.point);
    let aResult = req.body.data.point;
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

app.delete('/Route', function (req, res) {
    //todo delete dependencies
    Route.findOneAndDelete(req.query, function (err, data) {
        if (err)
            throw err;
        console.log(data);
        res.send('deleted Route');
        console.log('successfully deleted Route');
    });
});

app.delete('/LikedRoute', function (req, res) {
    console.log('inseide liked route');
    console.log(req.query._id);
    let query = {};
    query.route = req.query._id;
    query.user = req.query.user;
    console.log("QUERY");
    console.log(query);
    Favourite.findOneAndDelete(query, function (err, data) {
        if (err)
            throw err;
        console.log(data);
        res.send('deleted Fav for Route');
        console.log('successfully deleted Fav for Route');
    });
});


app.post('/saveRoute', function (req, res, next) {
        let oRoute = req.body;
        req.body.image = null;
        console.log("REQ BODY");
        console.log(req.body);
        oRoute.user = req.body.user;


        let url = "https://eu1.locationiq.com/v1/reverse.php?key=267f953f1517c5&lat=" + req.body.points[0].lat + "&lon=" + req.body.points[0].lng + "&format=json";
        request({
            url: url,
            method: 'GET'
        }, function (err, res, body) {
            if (err) throw err;
            res.body = JSON.parse(res.body);
            console.log(res.body.address);
            console.log("Stadt");
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

            let oImage = new Image();
            oImage.imageData = req.body.images;
            oImage.save()
                .then(item => {
                    console.log('image saved to database');
                    oRoute.image = item._id;
                    req.oRoute = oRoute;
                    next();

                })


            //todo save image as Buffer?
            //oRoute.image = new Buffer(req.body.images.split(",")[1],"base64");
            // oRoute.image = req.body.images;


            //oRoute.image = new Buffer(req.body.images, 'binary').toString('base64');

            //oRoute.image = new Buffer(req.body.images);
            //req.oRoute = oRoute;
            //next();
        });
    },

    function (req, res) {
        console.log("ROUTE to SAVE");
        console.log(req.oRoute);
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

app.post('/saveRating', function (req, res, next) {
    console.log("inSaveRating");
    //todo get rating number
    //req.body.user = "5bf86b725d5d083aea9d6093";
    //req.body.route = "5c012bb83a4ece84eeb4038f";
    //req.body.comment = "Nicht zu empfehlen";
    //req.body.rating = 3;
    console.log(req);
    console.log("REYBODY");
    console.log(req.body);
    if (req.body.route == undefined) {
        console.log("route is null");
        return;
    }
    if (req.body.image != undefined) {
        let oImage = new Image();
        oImage.imageData = req.body.image;
        oImage.save()
            .then(item => {
                console.log('image saved to database');
                req.body.image = item._id;
                next();
            })
            .catch (err=> {
                console.log('unable to save image');
            })
    } else {
        next();
    }

}, function (req, res) {

    Rating.deleteMany({user: req.body.user, route: req.body.route})
        .then(item => {
            console.log('deleted items');
            let oDataRating = new Rating(req.body);
            oDataRating.save()
                .then(item => {
                    console.log('comment');

                    res.send(item);
                }).catch(err => {
                console.log('unable to save');
                res.status(400).send("unable to save to database");
            });

        }).catch(err => {
        console.log('unable to delete');
        res.status(400).send("unable to delete old comment in database");
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
    Rating.find({route: req.query.route}).populate('user').exec(function (err, data) {
        if (err)
            throw err;
        // don't send password to FrontEnd
        data.forEach(function (element) {
            element.user.password = null;
        });
        res.send(data);
    });
});

app.get('/getRoutes', function (req, res, next) {
        console.log(req.query.distance);
        let paramText = req.query.search;
        let paramDifficulty = req.query.difficulty;
        console.log(req.query.features);
        let paramDistance = req.query.distance;
        let routeQuery;

        if (paramText === '' && paramDifficulty === undefined && req.query.features === undefined) {
            routeQuery = {distance: {$lt: paramDistance}};
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
            //difficulty kann mehrere Filter enthalten => Array
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
                    console.log(difficultyParam);
                    routeQuery.$and.push(difficultyParam);
                }
            }

            if (req.query.features != undefined) {
                routeQuery.$and.push({features: {$all: req.query.features}});
            }
            routeQuery.$and.push({distance: {$lt: req.query.distance}});
        }
        ;
        console.log("ROUTEQUERY");
        console.log(routeQuery);
        Route.find(routeQuery).lean().then(function (data) {
            //no route was found for query
            console.log("findRoute");
            console.log(data.length);
            if (data.length === 0) {
                res.send(data);
            }
            req.routes = data;
            next();
        }).catch(function (error) {
            console.log("Error getting user: ");
            console.log(error);
            next();
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
            Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                if (oneRoute.image != undefined)
                // todo oneRoute.image.toString('base64');
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
    },
    function (req, res, next) {
        let oRoutes = [];
        let iFinishedQueries = 0;
        for (let i in req.oRoutes) {
            Favourite.findOne({$and: [{route: req.oRoutes[i]._id}, {user: user}]}, function (err, obj) {
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
        if (req.query.sortBy != undefined) {
            let paramSort;
            if (req.query.sortBy == 1) {
                //Sort by name
                paramSort = 'title';
            } else if (req.query.sortBy == 2) {
                //Sort by average rating
                paramSort = 'avg_rating';
            } else if (req.query.sortBy == 3) {
                //Sort by date created
                paramSort = 'created';
            }
            sortJson(req.oRoutes, paramSort);
        }

        res.send(req.oRoutes);
    }
);


app.get('/getLocalPoints', function (req, res) {
    Point.find({}, function (err, data) {
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
    // todo: check if user already exists
    // todo: check if password length > 8
    // todo: check if email is syntactically correct
    let myData = new User(req.body);
    bcrypt.hash(myData.password, BCRYPT_SALT_ROUNDS)
        .then(function (hashedPassword) {
            myData.password = hashedPassword;
            return myData.save();
        })
        .then(function () {
            res.send();
        })
        .catch(function (error) {
            console.log("Error saving user: ");
            console.log(error);
            next();
        });
});

app.get('/login', function (req, res) {
    let aResult = req.query;
    User.findOne(
        //     {$or: [{email: aResult.email}, {username: aResult.username}]}
        {$or: [{email: aResult.user}, {username: aResult.user}]}
    ).then(function (user) {
        if (!user) {
            console.log("User nicht vorhanden");
            res.sendStatus(500);
        } else {
            bcrypt.compare(req.query.password, user.password, function (err, result) {
                if (result == true) {
                    req.session.user = user.id;
                    req.session.admin = true;
                    res.send(user);
                } else {
                    res.sendStatus(500);
                }
            });
        }
    });
});

app.get('/Image', function (req, res, next) {
    console.log('getMyRoutes');
    let routeQuery = {};
    //routeQuery.user = "5bf86b725d5d083aea9d6090";
    routeQuery.user = req.query.user;
    Image.findOne({_id: req.query.id}).lean().exec(function (err, data) {
        if (err) {
            res.sendStatus(404);
        }else {
            let img = Buffer.from(data.imageData.split(',')[1], 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/jpg',
                'Content-Length': img.length,
                'Cache-Control': 'public, max-age=2592000',
                'Expires': new Date(Date.now() + 2592000000).toUTCString()
            });
            res.end(img);
        }
    })
});


app.get('/getMyRoutes', function (req, res, next) {
        console.log('getMyRoutes');
        let routeQuery = {};
        //routeQuery.user = "5bf86b725d5d083aea9d6090";
        routeQuery.user = req.query.user;
        Route.find(routeQuery).lean().exec(function (err, data) {
            if (err)
                throw err;
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
                if (oneRoute.distance > 0)
                    oneRoute.distance = Math.round(oneRoute.distance * 100) / 100;
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
        if (req.query.sortBy != undefined) {
            let paramSort;
            if (req.query.sortBy == 1) {
                //Sort by name
                paramSort = 'title';
            } else if (req.query.sortBy == 2) {
                //Sort by average rating
                paramSort = 'avg_rating';
            } else if (req.query.sortBy == 3) {
                //Sort by date created
                paramSort = 'created';
            }

            sortJson(req.oRoutes, paramSort);

        }
        res.send(req.oRoutes);
    }
)
;

app.get('/getMyLikedRoutes', function (req, res, next) {
        console.log('getMyLikedRoutes');
        let routeQuery = {};
        //routeQuery.user = user;
        routeQuery.user = req.query.user;
        console.log(routeQuery.user);
        Favourite.find(routeQuery).exec(function (err, data) {
            if (err)
                throw err;
            console.log(data);
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
            Route.findOne({_id: aFavRoutes[i].route}).lean().exec(function (err, data) {
                if (err)
                    throw err;
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
                    req.favRoutes = oRoutes;
                    next();
                }
            });
        }
    },
    function (req, res) {
        if (req.query.sortBy != undefined) {
            let paramSort;
            if (req.query.sortBy == 1) {
                //Sort by name
                paramSort = 'title';
            } else if (req.query.sortBy == 2) {
                //Sort by average rating
                paramSort = 'avg_rating';
            } else if (req.query.sortBy == 3) {
                //Sort by date created
                paramSort = 'created';
            }
            sortJson(req.favRoutes, paramSort);
        }
        if (req.favRoutes.length == 0) {
            res.send([]);
        } else {
            res.send(req.favRoutes);
        }
    }
)
;

app.post('/Review', function (req, res, next) {
    let oReview = req.body;
    console.log(oReview);
    //oRoute.user = req.body.user;
});


app.get('/reviewedRoutes', function (req, res, next) {
        console.log('getMyReviewedRoutes');
        let routeQuery = {};
        routeQuery.user = req.query.user;
        console.log(routeQuery.user);
        Rating.find(routeQuery).populate('user').exec(function (err, data) {
            if (err)
                throw err;
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
            Route.findOne({_id: aCommentedRoutes[i].route}).lean().exec(function (err, data) {
                if (err)
                    throw err;
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
            Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
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
            });
        }
    },
    function (req, res) {
        if (req.query.sortBy != undefined) {
            let paramSort;
            if (req.query.sortBy == 1) {
                //Sort by name
                paramSort = 'title';
            } else if (req.query.sortBy == 2) {
                //Sort by average rating
                paramSort = 'avg_rating';
            } else if (req.query.sortBy == 3) {
                //Sort by date created
                paramSort = 'created';
            }
            sortJson(req.favRoutes, paramSort);
        }
        console.log("reqFavROutes");
        console.log(req.favRoutes);
        if (req.favRoutes.length === 0) {
            console.log("res send []");
            res.send([]);
        } else {
            console.log("res send");
            console.log(req.favRoutes);
            res.send(req.favRoutes);
        }
    }
)
;

app.listen(3001, function () {
    console.log("Working on port 3001");
});

savePhoto = function () {
    const category = new Category();

    const img = req.body.files;
    const split = img.split(',');
    const base64string = split[1];
    const buffer = Buffer.from(base64string, 'base64');

    category.img.data = buffer;
}


app.delete('/Rating', function (req, res) {
    console.log('inseide delete rating');
    console.log(req);
    console.log(req.query._id);

    Rating.findOneAndDelete({_id: req.query._id}, function (err, data) {
        if (err)
            throw err;
        console.log(data);
        res.send('deleted Rating for Route');
        console.log('successfully deleted Fav for Route');
    });
});