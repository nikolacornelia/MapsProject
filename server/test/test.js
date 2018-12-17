let mocha = require('mocha');
let assert = require('assert');
let Schema = require('../schema_model');
let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = 'http://localhost:3001';
const mongoose = require('mongoose');
const request = require("request");
const should = chai.should();
const app = require('../app');
const url = 'http://localhost:3001';
const expect = require('chai').expect;
let Cookies;
const {users, routes, ratings, images, favourites, points} = mongoose.connection.collections;
mongoose.set('useCreateIndex', true);
chai.use(chaiHTTP);

    mocha.before((done) => {
        users.drop(() => {
            routes.drop(() => {
                done();
            });
        });
    });

/** mocha.beforeEach((done) => {
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
}); **/

//Describe tests
mocha.describe('--MOCHA-- Test containing log in, registration, route creation and search', function () {

    mocha.it('GET no log in possible with wrong user and password', function (done) {
        chai.request(url)
            .get('/login')
            .query({user: 'max', password: 'maxmust'})
            .end(function (err, res) {
            expect(res.statusCode).equal(500);
            done();
        });
    })

    mocha.it('POST registration of new user', function (done) {
        chai.request(url)
            .post('/register')
            .send({
                'username': 'max',
                'email': 'max@mustermann.de',
                'password': 'maxmust'
            }).end(function (err, res) {
            expect(res.statusCode).to.not.equal(400);
            done();
        });
    });

    mocha.it('GET log in with user & password of new registration', function (done) {
        chai.request(url)
            .get('/login')
            .query({user: 'max', password: 'maxmust'})
            .end(function (err, res) {
               expect(res.statusCode).to.not.equal(500);
               expect(res.statusCode).to.not.equal(400);
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                done();
            });
    })

    mocha.it('POST save short route', function (done) {
        chai.request(url)
            .post('/saveRoute')
            .set('Cookie', Cookies)
            .send({
                'title': 'MochaRoute',
                'description': 'A route for test purpose',
                'difficulty': 'moderate',
                'features': ['River'],
                'points':  [ { lat: 49.49328079713773, lng: 8.483843657115468 },
                         { lat: 49.495651756902404, lng: 8.474015519311555 },
                        { lat: 49.49127430311358, lng: 8.469630817088493 },
                        { lat: 49.48887754967851, lng: 8.475942863867827 }],
                'highlights': [ 0, 1, 0, 0],
                'images': null,
                'distance': 4,

            }).end(function (err, res) {
                if(err) {
                    done(err);}
            expect(res.statusCode).to.not.equal(400);
            expect(res.statusCode).to.not.equal(401);
            done();
        });

    });


    mocha.it('POST save long route', function (done) {
        chai.request(url)
            .post('/saveRoute')
            .set('Cookie', Cookies)
            .send({
                'title': 'I will walk 500 miles',
                'description': 'A long route for test purpose',
                'difficulty': 'difficult',
                'features': ['River'],
                'points':  [ { lat: 49.49328079713773, lng: 8.483843657115468 },
                    { lat: 49.495651756902404, lng: 8.474015519311555 }],
                'highlights': [ 0, 1 ],
                'images': null,
                'distance': 8,
            }).end(function (err, res) {
            expect(res.statusCode).to.not.equal(400);
            expect(res.statusCode).to.not.equal(401);
            done();
        });

    });


    mocha.it('this should GET all routes (no filter used and distance not limited)', (done) => {
        chai.request(url)
            .get('/getRoutes?distance=25')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.body.should.be.a('array');
                Schema.Route.countDocuments(function (err, count) {
                    if (err)
                        throw err;
                    expect(res.body).to.have.length(count);
                    done();
                });
            });
    });

   mocha.it('this should GET only the route shorter than 5 kilometer', (done) => {
        chai.request(url)
            .get('/getRoutes?distance=5')
            .end(function (err, res) {
                expect(err).to.be.null;
                res.body.should.be.a('array');
                expect(res.body).to.have.length(1);
                res.body[0].title.should.be.equal('MochaRoute');
                done();
            });
    });


})




