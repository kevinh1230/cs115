var assert = require('assert');
var should = require('should');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('../../config/db');
var User = require('../../app/models/User');
var app = require('../../server');

describe('SPLIT Test', function() {
    var url = 'http://localhost:8080';
    var cookie;

    before(function(done) {
        User.remove({username:'test1'});
        User.remove({username:'test2'}).exec(function() {
            done();
        });
    });

    describe('Signup', function () {
        it('should create Test1', function(done) {
            var body = {
                firstName: 'Test1',
                lastName: 'Split',
                email: 'test1@split.com',
                username: 'test1',
                password: '123'
            }
            request(url).post('/signup').send(body).expect(302,done);
        });
    });

    describe('Signup', function () {
        it('should create Test2', function(done) {
            var body = {
                firstName: 'Test2',
                lastName: 'Split',
                email: 'test2@split.com',
                username: 'test2',
                password: '123'
            }
            request(url).post('/signup').send(body).expect(302,done);
        });
    });
    
    describe('Login', function () {
        it('should return 200 if username and password are correct', function(done) {
            var body = {
                username: 'test1',
                password: '123'
            };
            request(url).post('/login').send(body).expect(200).end(function(err, res) {
                res.statusCode.should.equal(200);
                cookie = res.headers['set-cookie'];
                done();
            });
        });

        it('should return 400 if username and password are wrong', function(done) {
            var body = {
                username: 'jcheun',
                password: '1'
            };
            request(url).post('/login').send(body).expect(200).end(function(err, res) {
                res.statusCode.should.equal(400);
                err.should.not.equal(null);
                done();
            });
        });
        
    });
    
    describe('Get Data From Server', function () {
        it('should get all users from server', function(done) {
            request(url).get('/getUsers').expect(200).end(function(err, res) {
                User.count().exec(function(err,count) {
                    res.body.length.should.equal(count);
                    done();
                });
            });
        });

        it('should get user from server', function(done) {
            request(url).get('/user').set('cookie', cookie).end(function(err,res) {
                res.statusCode.should.equal(200);
                done();
            });
        });
    });
});
