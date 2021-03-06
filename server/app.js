require('express-async-errors');
let express = require('express');
let mongoose = require('mongoose');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let Schema = require('./schema_model');
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
let bcrypt = require('bcrypt');
let request = require('request');
let sortJson = require('sort-json-array');
let session = require('express-session');
let _ = require('underscore');

var auth = function (req, res, next) {
    if (req.session && req.session.userid) {
        return next();
    } else {
        return res.sendStatus(401);
    }
};

var BCRYPT_SALT_ROUNDS = 12;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
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

app.listen(3001, function () {
    console.log("Working on port 3001");
});

//change database to e.g. 'maps_test' to conduct test (without affect on productive database)
mongoose.connect('mongodb://localhost:27017/maps', function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection to mongodb established');
        }
    }
);
mongoose.connection.once('open', function () {
    console.log('Connection open');
});

// user management
app.post('/register', function (req, res) {
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
        {$or: [{email: aResult.user}, {username: aResult.user}]}
    ).then(function (user) {
        if (!user) {
            console.log("User missing");
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
    res.sendStatus(200);
});

//route functionality
app.post('/savePoint', auth, function (req, res) {
    let aResult = req.body.data.point;
    aResult = JSON.parse(aResult);
    let myData = new Schema.Point(aResult);
    myData.save()
        .then(item => {
            res.send("point saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save point to database");
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

app.get('/getLocalPoints', function (req, res) {
    Schema.Point.find({}, function (err, data) {
        if (err) {
            res.status(404).send("unable to get points");
            throw err;
        }
        res.send(data);
    });

});

app.post('/saveRoute', auth, function (req, res, next) {
        let oRoute = req.body;
        req.body.user = req.session.userid;
        //access api to get location according to longitude and latitude
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
            //geolocation response is different depending on location
            try {
                if (res.body.address.city != undefined) {
                    oRoute.location = res.body.address.city;
                }
                else if (res.body.address.town != undefined) {
                    oRoute.location = res.body.address.town;
                }
                else if (res.body.address.village != undefined) {
                    oRoute.location = res.body.address.village;
                }
            }
            catch (e) {
                res.status(404).send("unable to get location from API");
            }
            if (req.body.images != undefined) {
                let oImage = new Schema.Image();
                oImage.imageData = req.body.images;
                oImage.save()
                    .then(item => {
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
        oData.save()
            .then(item => {
                res.send("route saved to database");
            })
            .catch(err => {
                res.status(400).send("unable to save route to database");
            });
    });

app.get('/getRoutes', function (req, res, next) {
        let paramText = req.query.search;
        let paramDifficulty = req.query.difficulty;
        let paramDistance = req.query.distance;
        let routeQuery;
        //important if method accessed via test
        if (paramText === undefined) {
            paramText = '';
        }
        //if user hasn't selected any parameters for the search
        if (paramText === '' && paramDifficulty === undefined && req.query.features === undefined) {
            routeQuery = {distance: {$lt: paramDistance}};
        }
        else {
            //text parameter -> filter
            routeQuery = {$and: []};
            if (paramText != '') {
                console.log(paramText);
                routeQuery.$and.push({
                    $or: [{title: {$regex: paramText, $options: "i"}}, {
                        description: {
                            $regex: paramText,
                            $options: "i"
                        }
                    }, {location: {$regex: paramText, $options: "i"}}]
                });
            }
            //difficulty parameter -> filter
            if (paramDifficulty != undefined) {
                if (paramDifficulty.length == 1) {
                    routeQuery.$and.push({difficulty: paramDifficulty[0]});
                } else {
                    let difficultyParam = {$or: []};
                    for (let i = 0; i < paramDifficulty.length; i++) {
                        difficultyParam.$or.push({difficulty: paramDifficulty[i]});
                    }
                    routeQuery.$and.push(difficultyParam);
                }
            }
            //feature parameters -> filter
            if (req.query.features != undefined) {
                routeQuery.$and.push({features: {$all: req.query.features}});
            }

            //distance parameter -> filter
            routeQuery.$and.push({distance: {$lt: req.query.distance}});
        }
        ;
        Schema.Route.find(routeQuery).lean().then(function (data) {
            if (data.length === 0) {
                // if no routes fits the routeQuery -> function doesn't have to continue
                res.send(data);
            }
            req.routes = data;
            next();
        }).catch(function (error) {
            res.status(404).send(error.errmsg);
        });
    },
    function (req, res, next) {
        let aRoutes = req.routes;
        let oRoutes = [];
        let iFinishedQueries = 0;
        //calculate the average rating for routes
        for (let i in aRoutes) {
            Schema.Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
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
                oRoutes.push(oneRoute);
                iFinishedQueries++;
                if (iFinishedQueries === (aRoutes.length)) {
                    req.oRoutes = oRoutes;
                    next();
                }
            }).catch(function (error) {
                res.status(400).send("error while accessing rating");
            });
            ;
        }
    },
    function (req, res, next) {
        let oRoutes = [];
        let iFinishedQueries = 0;
        for (let i in req.oRoutes) {
            //when user is logged in: is route one of his/hers favorites?
            Schema.Favourite.findOne({$and: [{route: req.oRoutes[i]._id}, {user: req.session.userid}]}, function (err, obj) {
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
    });

app.get('/Image', function (req, res, next) {
    let routeQuery = {};
    routeQuery.user = req.session.userid;
    Schema.Image.findOne({_id: req.query.id}).lean().exec(function (err, data) {
        if (err) {
            console.log('error');
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

// user interaction with routes
app.get('/getMyRoutes', auth, function (req, res, next) {
        let routeQuery = {};
        routeQuery.user = req.session.userid;
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
            Schema.Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = 0;
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
    });

app.post('/favoriseRoute', auth, function (req, res) {
    //function decides if favourit has to get deleted or created
    let oFavourite = {};
    oFavourite.route = req.body.route;
    oFavourite.user = req.session.userid;
    if (req.body.isFavorised == false) {
        Schema.Favourite.deleteMany(oFavourite, function (err) {
            if (err) throw (err);
            res.status(200).send();
        });
    } else {
        let myData = new Schema.Favourite(oFavourite);
        myData.save()
            .then(item => {
                res.send(item);
            })
            .catch(err => {
                res.status(400).send("unable to save favourized route to database");
            });
    }
});

app.get('/Favourite', function (req, res) {
    Schema.Favourite.findOne({$and: [{route: req.query.id}, {user: req.session.userid}]}, function (err, obj) {
        if (err) {
            res.status(404).send("unable to find favourites");
            throw err;
        }
        if (obj === null) {
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

app.delete('/Route', auth, function (req, res) {
    Schema.Route.findOneAndDelete(req.query).then(item => {
        Schema.Favourite.deleteMany({route: req.query._id}, function (err, data) {
        }).then(item => {
            Schema.Rating.deleteMany({route: req.query._id}).then(item => {
                res.send();
            })
        })
    });
});

app.get('/getMyLikedRoutes', auth, function (req, res, next) {
        let routeQuery = {};
        routeQuery.user = req.session.userid;
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
        let iFinishedQueries = 0;

        for (let i in aFavRoutes) {
            Schema.Route.findOne({_id: aFavRoutes[i].route}).lean().exec(function (err, data) {
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
    },
    function (req, res, next) {
        let aRoutes = req.oRoutes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;

        for (let i in aRoutes) {
            Schema.Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = 0;
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
    });

app.delete('/LikedRoute', auth, function (req, res) {
    let query = {};
    query.route = req.query._id;
    query.user = req.session.userid;
    Schema.Favourite.findOneAndDelete(query, function (err, data) {
        if (err) {
            res.status(404).send("unable to delete like of user for a route ");
            throw err;
        }
        res.send('deleted Fav for Route');
    });
});

app.post('/saveRating', auth, function (req, res, next) {
        if (req.body.route == undefined) {
            res.status(400).send("error while saving rating because route/user is undefined");
            return;
        }
        req.body.user = req.session.userid;
        if (req.body.image != undefined) {
            let oImage = new Schema.Image();
            oImage.imageData = req.body.image;
            oImage.save()
                .then(item => {
                    req.body.image = item._id;
                    next();
                })
                .catch(err => {
                    res.status(400).send("unable to save image");
                })
        } else {
            next();
        }
    },
    function (req, res) {
    //old rating + comment gets deleted when user creates a new one for the same route
        Schema.Rating.deleteMany({user: req.session.userid, route: req.body.route})
            .then(item => {
                let oDataRating = new Schema.Rating(req.body);
                oDataRating.save()
                    .then(item => {
                        res.send('success saving new rating');
                    }).catch(err => {
                    res.status(400).send("unable to save rating to database");
                });
            }).catch(err => {
            res.status(400).send("unable to delete old comment in database");
        });

    });

app.get('/getRatings', function (req, res) {
    Schema.Rating.find({route: req.query.route}).populate('user').exec(function (err, data) {
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

app.delete('/Rating', auth, function (req, res) {
    Schema.Rating.findOneAndDelete({_id: req.query._id}, function (err, data) {
        if (err) {
            res.status(404).send("error while finding and deleting rating");
            throw err;
        }
        res.send('deleted Rating for Route');
    });
});

app.post('/review', auth, function (req, res) {
    Schema.Rating.findOneAndUpdate({_id: req.body.commentId}, {
        comment: req.body.review,
        rating: req.body.rating,
        created: req.body.date
    }, {upsert: true}).then(item => {
        res.send()
    });
});

app.get('/reviewedRoutes', function (req, res, next) {
        let routeQuery = {};
        routeQuery.user = req.session.userid;
        Schema.Rating.find(routeQuery).lean().populate('user').exec(function (err, data) {
            if (err) {
                res.status(404).send("error while finding rating");
                throw err;
            }
            ;
            data.forEach(function (data) {
                data.user.password = null;
            });
            req.comment = data;
            if (data.length == 0) {
                res.send(data);
            }
            next();
        })
    },
    function (req, res, next) {
        let aCommentedRoutes = req.comment;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;

        for (let i in aCommentedRoutes) {
            Schema.Route.findOne({_id: aCommentedRoutes[i].route}).lean().exec(function (err, data) {
                if (err) {
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
                    req.oRoutes = oRoutes;
                    next();
                }
            })
        }
        ;
    },
    function (req, res, next) {
        let aRoutes = req.oRoutes;
        let oRoutes = [];
        //amount of finished queries;
        let iFinishedQueries = 0;

        for (let i in aRoutes) {
            Schema.Rating.aggregate([{$match: {route: aRoutes[i]._id}}
                , {$group: {_id: null, rating: {$avg: '$rating'}}}
            ]).then(function (response) {
                let oneRoute = aRoutes[i];
                // one route may not have a rating yet
                if (response.length == 0) {
                    oneRoute.avg_rating = 0;
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
    });


//functions outsourced for sort routes (used more than onces)
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