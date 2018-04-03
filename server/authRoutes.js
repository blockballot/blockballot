const auth = require('../helpers/authHelpers.js');
const bcrypt = require('bcrypt');
const dbHelpers = require('../database/dbHelpers.js');
const helpers = require('../helpers/helpers.js');
const url = require('url');

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  dbHelpers.findOrg(email)
    .then((org) => {
      if (!org) {
        res.status(401).send('Account not recognized.');
      } else {
        auth.comparePassword(password, org, (match) => {
          if (match) {
            auth.createSession(req, res, org);
          } else {
            res.status(402).send('Incorrect password. Please try again.');
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send('There was an error. Please try again later.');
    });
}

const signup = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10).then((hash) => {
    dbHelpers.findOrg(email)
      .then((org) => {
        if (org === null) {
          dbHelpers.createOrg(name, email, hash)
            .then((newUser) => {
              if (newUser) {
                res.status(200).send();
              } else {
                res.status(500).send('There was an error. Please try again later.');
              }
            })
        } else {
          res.status(401).send('Account already exists');
        }
      })
      .catch((err) => {
        res.status(500).send('There was an error. Please try again later.');
      });
  });
}

const password = (req, res) => {
  res.status(200).send(helpers.createPassword());
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('loggedIn');
    res.redirect('/');
  });
}

const resettoken = function(req,res) {
  let token = req.params.token;
  dbHelpers.verifyToken(token)
    .then(result => {
      res.redirect(url.format({
        pathname:"/reset",
        query: {
          'token': token,
        }
      }));
    })
    .catch(err => {
      res.redirect(url.format({
        pathname:"/reset",
        query: {
          'token': 'error'
        }
      }));
    })
}

const resetpassword = (req, res) => {
  let token = req.body.token;
  let password = req.body.password;
  bcrypt.hash(password, 10)
    .then(hash => {
      dbHelpers.updatePassword(token, hash)
      .then(result => {
        res.status(201).send();
      }).catch(err => {
        res.status(500).send(err);
      })
    });
}

module.exports = {
  login: login,
  signup: signup,
  password: password,
  logout: logout,
  resettoken: resettoken,
  resetpassword: resetpassword
};
