let mocha = require('mocha');
let assert = require ('assert');
let Schema = require('../schema_model');
let chai = require('chai');
let chaiHTTP = require ('chai-http');
let server = 'http://localhost:3001';
let should = chai.should();

mocha.describe('Maps', () => {
    mocha.beforeEach((done) => { //Before each test we empty the database
        Schema.Route.remove({}, (err) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    mocha.describe('/GET routes', () => {
        mocha.it('it should GET all the routes', (done) => {
            chai.request(server)
                .get('/getRoutes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});

//Describe tests
mocha.describe('saving records', function() {

//Create tests
    mocha.it('create route modell', function() {

        let route = Schema.Route({
            title: 'MochaRoute',
            description: 'Eine Route fürs Testen',
            difficulty: 'medium',
           // points: [{lat: Number, lng: Number}],
           // highlights: [Number],
            distance: '12',
            //location: String,
           // user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            //features: [String],
            //image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'
            });


        route.save().then(function()
        {
            assert(char.isNew === false);
            done();
        })
    });


})