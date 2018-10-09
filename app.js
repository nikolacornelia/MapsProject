//node app.js
//https://mongoosejs.com/docs/index.html
var express = require('express');
var app = express();

app.use('/', express.static(`${__dirname}/public`));

// Binding express app to port 3000
app.listen(8080, function(){
    console.log((new Date()) + " Server is listening on port 8080");
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/maps', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
});

var locationSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    name: String
  });
var Location = mongoose.model('Location', locationSchema);


var newLocation = function(object) {
    var oLocation = new Location({ latitude: 40, longitude: 30, name: "Pizzeria Calzone" });
    oLocation.save(function (err, oLocation) {
        if (err) return console.error(err);
    });;
  }

  newLocation();
