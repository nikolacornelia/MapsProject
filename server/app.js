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

let schemaPoint = new mongoose.Schema({
    name: String, description: String, category: String, latitude: Number, longitude: Number
});
let Point = mongoose.model("Point", schemaPoint);


let schemaRoute = new mongoose.Schema( { title: String, description: String,difficulty: String, points: [{lat: Number, lng: Number}], highlights: [Number]});
//let schemaRoute = new mongoose.Schema({title: String, description: String, difficulty: String});
let Route = mongoose.model("Route", schemaRoute);


//User 
let schemaUser = new mongoose.Schema({
    email: {type: String, unique: true}, username: String, password: String
});
let User = mongoose.model("User", schemaUser);

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

app.post('/saveRoute', function (req, res) {
    console.log(req.body);
    let oRoute = req.body;

    let oData = new Route(oRoute);
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

app.get('/getData', function (req, res) {
    Point.find({}, function (err, data) {
        res.send(data);
    });
});

app.get('/getRoutes', function (req, res) {
        console.log(req.query);
        var paramText = req.query.search;
        var param = {};
        if (paramText != '') {
            param.title = { $regex: paramText, $options: "i"};
        }
        //difficulty kann mehrer Filter enthalten --> Array
        var paramDifficulty = req.query.difficulty;
        if (paramDifficulty != null) {
            if (paramDifficulty.length = 1) {
                param.difficult = paramDifficulty[0];
            } else {
                var param = "{$or: [{difficulty:'";

                for (var i = 0; i < paramDifficulty.length; i++) {
                    if (i = 0) {
                        param = param + paramDifficulty[i] + "'}]"
                    } else {
                        param = ", {difficulty:'" + paramDifficulty[i] + "'}]"
                    }
                    param = param + "}";

                }

                param.difficulty = paramDifficulty;
            }
        }

        /** var paramLength = req.body.length;
         if (paramLength!=''){
        param.length = paramLength;
    } **/

        console.log(param);

        Route.find(param, function (err, data) {
            res.send(data);
        });
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

