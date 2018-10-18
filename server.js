let multer  =   require('multer');
let express = require('express');
let http = require('http');
let path = require('path');
let mongoose = require('mongoose');
let app = express();
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let Schema = require('./schema_model');
let oSchema = Schema.sPointOfInterest();
let jQuery = require('jQuery');
const {ObjectID} = require("mongodb");


app.use(bodyParser());
app.use(methodOverride());
//app.use(app.router);
app.use('/', express.static(`${__dirname}/public`));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

mongoose.connect('mongodb://localhost:27017/maps');
mongoose.connection.once('open', function() {
    console.log("connected");
});

var defineSchema = new mongoose.Schema({
   name: String, description: String, category: String, latitude: Number, longitude: Number
    });

var Point = mongoose.model("Point", defineSchema);

app.post('/test',function(req,res){
    console.log('Node function started');
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

    

   /**  let oNewPoint = new mSchema({
             name: aResult.sName,
             description: aResult.sDescription,
             category: aResult.sCategory, latitude: aResult.nLatitude, longitude: aResult.nLongitude
           });
    console.log(oNewPoint);
    mSchema.save(function(err,doc){
              if(err) res.send('Error while inserting');
              else    res.send('Successfully inserted!');
           });
    }); **/




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
let upload = multer({ storage : storage}).single('userPhoto');
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
app.listen(3001,function(){
    console.log("Working on port 3001");
});