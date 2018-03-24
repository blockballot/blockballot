require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');

const auth = require('../helpers/authHelpers.js');
const db = require('../database/index.js');
const helpers = require('../helpers/helpers.js')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secrettoken',
  resave: false,
  saveUninitialized: true
}));

app.post('/login', (req, res) => {
  console.log('hi')
  let email = req.body.email;
  let password = req.body.password;
  db.Org.findOne({ where: { orgEmail: email } })
    .then(org => {
      if (!org) {
        res.status(401).send('Account not recognized.');
      } else {
        auth.comparePassword(password, org, (match) => {
          if (match) {
            auth.createSession(req, res, org);
            console.log(`Session has been created for ${org.dataValues.orgEmail}`);
            res.status(200).send();
          } else {
            res.status(402).send('Incorrect password. Please try again.');
          }
        });
      }
    });
});

app.post('/signup', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  console.log('INFO', name, email, password);

  bcrypt.hash(password, 10).then(hash => {
    db.Org.findOne({where: {orgName: name}}).then(org => {
      if (!org) {
        db.Org.create({orgName: name, orgEmail: email, orgPassword: hash})
          .then(newUser => {
            if (newUser) {
              res.status(200).send();
            } else {
              res.status(500).send('There was an error. Please try again later.')
            }
          })
      } else {
        res.status(401).send('Account already exists');
      }
    });
  });
});

app.get('/password', (req, res) => {
  res.status(200).send(helpers.createPassword());
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('loggedIn');
    console.log('You are logged out');
    res.redirect('/login');
  });
});

/*for Test*/
app.post('/api/Voter', (req, res) => {
  db.VoteKey.findOne({where: {voterUniqueId: req.body.uniqueId}}).then(voteruniqueid => {
    if (!voteruniqueid) {
      res.status(500).send('Invalid unique ID. Please try again.')
    } else {
      res.status(200).send(`User logged in with ${voteruniqueid}`);
    }
  })
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;