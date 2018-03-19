const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const request = require('request');
const db = require('../database/index.js');

let isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

let checkUser = (req, res, next) => {
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

let createSession = (req, res, newUser) => {
  return req.session.regenerate(() => {
    res.cookie('loggedIn', 'true', { maxAge: 60 * 60 * 1000 });
    res.cookie('username', newUser.dataValues.orgEmail, { maxAge: 60 * 60 * 1000 });
    req.session.user = newUser.dataValues.orgEmail;
  });
};

let comparePassword = (attemptedPassword, org, callback) => {
  let existingPassword = org.orgPassword;
  bcrypt.compare(attemptedPassword, existingPassword, (err, isMatch) => {
    callback(isMatch);
  });
}

module.exports = {
  isLoggedIn: isLoggedIn,
  checkUser: checkUser,
  createSession: createSession,
  comparePassword: comparePassword
};