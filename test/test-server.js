let chai = require('chai');
let expect = require('chai').expect;
let request = require('supertest');
let server = require('../server/index.js');
let db = require('../database/index.js');
let Sequelize = require("sequelize");


describe('Server Functionality', function() {

  describe('User Authentication', function() {
    describe('signup', function() {
      it('should generate a unique 64-digit password for a new org', function(done) {
        request(server)
          .get('/password')
          .expect(function(res) {
            res.body.length = 64;
          })
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
      it('should save a new org to the database upon sign up', function(done) {
        request(server)
          .post('/signup')
          .send({
            name: 'Tester',
            email: 'test@test.com',
            password: '5340ff012095c1ad26a69b66e6ce11e8e36d72e7d236ad3913c44173591e65ad'
          })
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
      it('should not save duplicate orgs upon sign up', function(done) {
        request(server)
          .post('/signup')
          .send({
            name: 'Tester',
            email: 'test@test.com',
            password: '5340ff012095c1ad26a69b66e6ce11e8e36d72e7d236ad3913c44173591e65ad'
          })
          .expect(401)
          .end(function(err, res) {
            if (err) return done(err);
            db.Org.destroy({
              where: { orgEmail: 'test@test.com' }
            });
            done();
          });
      });
    });

    describe('login', function() {
      it('should create a session for a returning org upon log in', function(done) {
        request(server)
          .get('/login')
          .expect(200);
        done();
      });
    });

    describe('logout', function() {
      it('should destroy a session for an org upon log out', function(done) {
        request(server)
          .get('/logout')
          .expect(200);
        done();
      });
    });
  });
  
  describe('Serving Static Assets', function() {
    it('should return a 200 status code upon successful retrieval', function(done) {
      request(server)
        .get('/')
        .expect(200);
      done();
    });
  });
});