const expect = require('chai').expect;
const request = require('supertest');
const server = require('../server/index.js');
const db = require('../database/index.js');

describe('Server Functionality', function() {

  describe('User Authentication', function() {
    describe('signup', function() {
      it('should generate a unique 64-digit password for a new org', function(done) {
        request(server)
          .get('/password')
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.text.length).to.equal(64);
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
      it('should store an encrypted password in the database', function(done) {
        db.Org.findOne({
          where: { orgEmail: 'test@test.com' }
        }).then(function(org) {
          expect(org.dataValues.orgPassword).to.not.include('5340ff012095c1ad26a69b66e6ce11e8e36d72e7d236ad3913c44173591e65ad');
          expect(org.dataValues.orgPassword.length).to.equal(60);
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
            done();
          });
      });
    });

    describe('login and logout', function() {
      it('should create a session for a valid org upon log in', function(done) {
        request(server)
          .post('/login')
          .send({
            email: 'test@test.com',
            password: '5340ff012095c1ad26a69b66e6ce11e8e36d72e7d236ad3913c44173591e65ad'
          })
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.headers['set-cookie'][0]).to.include('loggedIn=true');
            done();
          });
      });
      it('should destroy a session for an org upon log out', function(done) {
        request(server)
          .get('/logout')
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.headers['set-cookie'][0].split(';')[0]).to.equal('loggedIn=');
            db.Org.destroy({
              where: { orgName: 'Tester' }
            });
            done();
          });
      });
      it('should return a 401 if an org logs in with an account that does not exist', function(done) {
        request(server)
        .post('/login')
        .send({
          name: 'Felix',
          email: 'does@notexist.com',
          password: '9340ff012430c1ad26a69b66e6ce11e8e36d72e7d236ad3913c44173591wq3ad'
        })
        .expect(401)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
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