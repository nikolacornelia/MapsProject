//node app.js

//https://mongoosejs.com/docs/index.html
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var kittySchema = new mongoose.Schema({
    name: String
  });
  var Kitten = mongoose.model('Kitten', kittySchema);

  var silence = new Kitten({ name: 'Silence' });
  console.log(silence.name); // 'Silence'
  var fluffy = new Kitten({ name: 'fluffy' });

  fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
  });
/* app.use('/', express.static(`${__dirname}/public`));

// Binding express app to port 3000
app.listen(8080, function(){
    console.log((new Date()) + " Server is listening on port 8080");
});

var MongoClient = require('mongodb').MongoClient;
var urlMongo = "mongodb://127.0.0.1:27017"; 
var url;

var callDatabase = MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("myNewDatabase");
    dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });

  var variable;
var dataAccess = function(variable, object) {
   switch (variable) {
        case "insertLocation":
            url = urlMongo + '/location';
            call callDatabase(url);
           break;
        case "changeLocation":
            url = urlMongo + '/location';
            break;
        case "addImageLocation":
            url = urlMongo + '/location';
            break;
   
       default:
           break;
   }
} */