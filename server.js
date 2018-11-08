let multer  =   require('multer');
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

let schemaPoint = new mongoose.Schema({
    name: String, description: String, category: String, latitude: Number, longitude: Number
     }); 
let Point = mongoose.model("Point", schemaPoint);
let schemaRoute = new mongoose.Schema({
    name: String, description:String, structure: [{ point: Object, order: Number}]
});
let Route = mongoose.model("Route", schemaRoute);


app.use(bodyParser());
app.use(methodOverride());

app.use('/', express.static(`${__dirname}/public`));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

let conn = mongoose.createConnection('mongodb://localhost:27017/maps');
conn.once('open', function() {
    console.log("connected");
    gfs = Grid(conn.db);
})

app.post('/savePoint',function(req,res){
    let aResult = req.body.point;
    aResult = JSON.parse(aResult);
    let myData = new Point(aResult);
   // myData =new Point({ name: "NameNew", description: "DescriptionNew", category: "CategoryNew", latitude: 4534, longitude: 2565});
   
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err=> {
            res.status(400).send("unable to save to database");
        });

    });

app.post('/saveRoute',function(req,res){
    //let aResult = req.body.route;
    //aResult = JSON.parse(aResult);
    //let oData = new Route(aResult);
    let oData =new Route({ name: "Wein und Berg", description:"vorsicht bei Regen", structure: [{ point: '5bce180d2203630b1066887e', order: 1}, {point: {lat: 49.49669, long: 8.41267}, order : 2}, {point: '5bce18392203630b1066887f', order: 3}]});   
    oData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err=> {
            res.status(400).send("unable to save to database");
        });

    });

 app.get('/getData', function(req,res){
    Point.find({}, function(err, data){
        res.send(data);
    });
 })   

 app.get('/getLocalPoints', function(req,res) {
    let oBorder = req.query.border;
    /** oBorder.dMinLat = parseFloat(oBorder.dMinLat);
    oBorder.dMaxLat = parseFloat(oBorder.dMaxLat);
    oBorder.dMinLong = parseFloat(oBorder.dMinLong);
    oBorder.dMaxLong = parseFloat(oBorder.dMaxLong); **/

    let dMinLat = Number(oBorder.dMinLat);
    let dMaxLat = Number(oBorder.dMaxLat);
    let dMinLong = Number(oBorder.dMinLong);
    let dMaxLong = Number(oBorder.dMaxLong);

    Point.find({latitude:{$gt:dMinLat, $lt:dMaxLat}}, function(err, data){
        if(err) {throw err;}
        res.send(data);
    });
        
 })

app.post('/saveDocument', function(req,res) {
    let source = fs.createReadStream('test.jpg');
    let target = gfs.createWriteStream({
        filename: 'test.jpg'
    });
    source.pipe(target);
});

app.get('/getDocument', function(req,res) {
    //important: there must be only one file with this filename, otherwise no photo gets displayed
    let filename = 'test.jpg';
    gfs.exist({ filename: filename }, (err,file) => {
        if (err || !file) {
            res.status(404).send('File not Found');
            return
        }
        let data = [];
        let readstream = gfs.createReadStream( {filename:filename});
        readstream.on('data', function(result){
           data.push(result);
        });
        readstream.on('end', function () {
            data = Buffer.concat(data);
            let img = 'data:image/jpg;base64,' + Buffer(data).toString('base64');
            res.send(img);
        });
        readstream.on('err', function(err) {
            throw err;
        })
    })
})


/** 
app.post('/new',function(req,res){
    console.log(req.body);
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
            new schema.sPointOfInterest({
             _id   :  new ObjectID(),
             name : req.body.name,
             email : req.body.email
           }).save(function(err,doc){
              if(err) res.json(err);
              else    res.send('Successfully inserted!');
           });
    });


});
let storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
let upload = multer({ storage : storage}).single('userPhoto'); **/

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
app.listen(3001,function(){
    console.log("Working on port 3001");
});