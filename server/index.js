const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
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
  let email = req.body.email;
  let password = req.body.password;
  db.Org.findOne({
    where: { orgEmail: email }
  }).then((org) => {
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
  }).catch((err) => {
    res.status(500).send('There was an error. Please try again later.')
  });
});

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10).then((hash) => {
    db.Org.findOne({
      where: { orgEmail: email }
    }).then((org) => {
      if (org === null) {
        db.Org.create({
          orgName: name, 
          orgEmail: email, 
          orgPassword: hash
        }).then((newUser) => {
          if (newUser) {
            res.status(200).send();
          } else {
            res.status(500).send('There was an error. Please try again later.')
          }
        });
      } else {
        console.log('org found in db');
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
    res.redirect('/');
  });
});

app.post('/api/voter', (req, res) => {
  dbHelper.retrieveCode(req.body.uniqueId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Invalid unique ID. Please input a valid unique ID.');
    });
});

app.post('/api/poll', (req, res) => {
  db.Option.findAll({
    where: { pollId: req.body.pollId },
    include: [db.Poll]
  })
    .then((option) => {
      if (!option) {
        res.status(500).send('There was an error. Please try again later.')
      } else {
        res.status(200).send(option);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error. Please try again later.')
    });
});

app.post('/api/voteresult', (req, res) => {
  dbHelper.submitVote(req.body.voteHash, req.body.optionId, req.body.keyId)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in submitting your vote');
    });
});

app.post('/blockchainvote', (req, res) => {
  blockchain.castVote(req.body.candidate, req.body.address)
    .then((hash) => {
      res.status(201).send(hash);
    })
    .catch((err) => {
      res.status(500).send('There was an error when creating the blockchain vote');
    });
});

app.post('/contract', (req, res) => {
  const options = req.body.options;
  blockchain.createContract(options)
    .then((contract) => {
      res.status(201).send(contract)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error when creating the blockchain vote');
    });
}); 

app.post('/poll', (req, res) => {
  dbHelper.createPoll(req.session.orgId, req.body)
    .then((newPoll) => {
      const optionArray = [];
      const pollOpts = req.body.pollOptions;
      for (let i = 0; i < pollOpts.length; i++) {
        optionArray.push(dbHelper.createOption(newPoll.dataValues.id, pollOpts[i])); 
      }
      return Promise.all(optionArray)
    })
    .then((results) => {
      res.status(201).send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in creating a new poll');
    });
});

// retrieve all polls for the logged in org
app.get('/polls', (req, res) => {
  dbHelper.retrievePolls(req.session.orgId)
    .then((polls) => {
      const promiseArr = [];
      for (let i = 0; i < polls.length; i++) {
        promiseArr.push(dbHelper.bundlePollVotes(polls[i]));
      }
      return Promise.all(promiseArr);
    })
    .then((bundledPolls) => {
      res.status(200).send(bundledPolls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving polls from server');
    });
});

app.post('/email', (req, res) => {
  mailer.sendPasswordReset(req.body.email)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in sending password reset');
    });
});

app.post('/emailcodes', (req, res) => {
  const emails = JSON.parse(req.body.emails);
  const pollId = req.body.pollId;
  mailer.sendEmailCodes(emails, pollId)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in sending voter Id');
    });
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;