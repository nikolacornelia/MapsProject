var express = require('express');
var app = express();

app.use('/', express.static(`${__dirname}/public`));

// Binding express app to port 3000
app.listen(8080, function(){
    console.log((new Date()) + " Server is listening on port 8080");
});
