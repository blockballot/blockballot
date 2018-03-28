const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');

const auth = require('../helpers/authHelpers.js');
const db = require('../database/index.js');
const mailer = require('../helpers/mailer.js');
const dbHelper = require('../database/dbHelpers.js');
const helpers = require('../helpers/helpers.js');
const blockchain = require('../helpers/blockchainHelpers.js');

const app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post('/api/voter', (req, res) => {
  db.VoteKey.findOne({where: {voterUniqueId: req.body.uniqueId}}).then(voteruniqueid => {
    if (!voteruniqueid) {
      res.status(500).send('Invalid unique ID. Please try again.')
    } else {
      res.status(200).send(voteruniqueid);
    }
  })
});

app.post('/api/poll', (req, res) => {
  db.Option.findAll({where: {pollId: req.body.pollId}, include: [db.Poll]}).then(option => {
    if (!option) {
      res.status(500).send('There was an error. Please try again later.')
    } else {
      res.status(200).send(option);
    }
  })
})

app.post('/api/voteresult', (req, res) => {
  db.Vote.create({voteHash: req.body.voteHash, optionId: req.body.voted })
    .then(newUser => {
      if (newUser) {
        res.status(200).send(newUser);
      } else {
        res.status(500).send('There was an error. Please try again later.')
      }
    }).catch(err =>
      console.log(err)
    )
});

/*for Test*/
app.post('/api/Voter', (req, res) => {
  console.log('server', db.checkVoter(req.body.uniqueId))
  res.send('Hello World')
});

app.post('/contract', (req, res) => {
  const options = req.body.options;
  blockchain.createContract(options, (contract) => {
    res.status(201).send(contract);
  });
}); 
app.post('/poll', (req, res) => {
  dbHelper.createPoll(req.session.orgId, req.body)
    .then(newPoll => {
      console.log('newPoll', newPoll)
      let optionArray = [];
      const pollOpts = req.body.pollOptions;
      console.log('xxxx',pollOpts)
      for (var i = 0; i < pollOpts.length; i++) {
        optionArray.push(dbHelper.createOption(newPoll.dataValues.id, pollOpts[i])); 
      }
      Promise.all(optionArray)
        .then(results => {
          res.status(201).send(results);
        })
        .catch(err => {
          res.status(500).send('There was an error in creating a new poll');
        })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('There was an error in creating a new poll');
    })
})

app.post('/email', (req, res) => {
  mailer.sendPasswordReset(req.body.email, function(err, result) {
    if (err) {
      res.status(500).send();
    } else {
      console.log('sending success status')
      res.status(201).send();
    }
  });
});

app.post('/emailcodes', (req, res) => {
  let emails = JSON.parse(req.body.emails);
  mailer.sendEmailCodes(emails, function(err, result) {
    if (err) {
      res.status(500).send();
    } else {
      console.log('sending success status')
      console.log(result)
      res.status(201).send(result);
    }
  });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;