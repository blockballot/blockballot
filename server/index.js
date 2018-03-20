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
  let email = req.body.email;
  let password = req.body.password;
  db.Org.findOne({ where: { orgEmail: email } })
    .then(org => {
      if (!org) {
        res.status(401).send('That org doesn\'t exist');
      } else {
        auth.comparePassword(password, org, (match) => {
          if (match) {
            auth.createSession(req, res, org);
            console.log(`Session has been created for ${org.dataValues.orgEmail}`);
            res.status(200).send();
          } else {
            res.status(401).send('Incorrect password. Please try again.');
          }
        });
      }
    });
});

app.post('/signup', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  bcrypt.hash(password, 10).then(hash => {
    db.Org.findOne({where: {orgEmail: email}}).then(org => {
      if (!org) {
        db.Org.create({orgEmail: email, orgPassword: hash})
          .then(newUser => {
            if (newUser) {
              res.status(200).send();
            } else {
              res.status(500).send('There was an error.')
            }
          })
      } else {
        res.status(401).send('This account already exists');
      }
    });
  });
});

app.get('/signup', (req, res) => {
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
  console.log('server', db.checkVoter(req.body.uniqueId))
  res.send('Hello World')
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;