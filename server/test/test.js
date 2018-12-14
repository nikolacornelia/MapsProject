let mocha = require('mocha');
let assert = require ('assert');
let Schema = require('../schema_model');
let chai = require('chai');
let chaiHTTP = require ('chai-http');
let server = 'http://localhost:3001';
let should = chai.should();
const mongoose = require('mongoose');
const request = require("request");


mocha.before((done) => {
    mongoose.connect('mongodb://localhost/maps_test');
    mongoose.connection
        .once('open', () => {
            done();
        })
        .on('error', (error) => {
            console.warn('Error', error);
        });
});

mocha.beforeEach((done) => {
    const {users, routes, ratings, images, favourites, points} = mongoose.connection.collections;
    users.drop(() => {
        routes.drop(() => {
            ratings.drop(() => {
                images.drop(() => {
                    favourites.drop(() => {
                        points.drop(() => {
                            done();
                        });
                    });

                });
            });
        });
    });
});


mocha.describe('Maps', () => {

    mocha.describe('/GET routes', () => {
        mocha.it('it should GET all the routes', (done) => {
            request('http://localhost:3001/getRoutes', function(error, response, body) {
                console.log(response);
                response.should.be.a('array');
               // chai.expect(response.statusCode).to.equal(200);
                done();
            });
            /**chai.request(server)
                .get('http://localhost:3001/getRoutes')
                .end((err, res) => {
                    //res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                }); **/
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


        route.save().then(function(done)
        {
            assert(route.isNew === false);
            done();
        })
    });


})