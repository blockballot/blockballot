const auth = require('../helpers/authHelpers.js');
const db = require('../database/index.js');
const helpers = require('../helpers/helpers.js');
const bcrypt = require('bcrypt');
const dbHelper = require('../database/dbHelpers.js');
const bodyParser = require('body-parser');
const blockchain = require('../helpers/blockchainHelpers.js');
const mailer = require('../helpers/mailer.js');
const path = require('path');
const url = require('url');

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
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
    res.status(500).send('There was an error. Please try again later.');
  });
}

const signup = (req, res) => {
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
            res.status(500).send('There was an error. Please try again later.');
          }
        });
      } else {
        console.log('org found in db');
        res.status(401).send('Account already exists');
      }
    });
  });
}

const password = (req, res) => {
  res.status(200).send(helpers.createPassword());
}

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('loggedIn');
    console.log('You are logged out');
    res.redirect('/');
  });
}

const voter = (req, res) => {
  dbHelper.retrieveCode(req.body.uniqueId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Invalid unique ID. Please input a valid unique ID.');
    });
}

const poll = (req, res) => {
  db.Option.findAll({
    where: { pollId: req.body.pollId },
    include: [db.Poll]
  })
    .then((option) => {
      if (!option) {
        res.status(500).send('There was an error. Please try again later.');
      } else {
        res.status(200).send(option);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error. Please try again later.');
    });
}

const voteresult = (req, res) => {
  dbHelper.submitVote(req.body.voteHash, req.body.optionId, req.body.keyId)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in submitting your vote');
    });
}

const blockchainvote = (req, res) => {
  blockchain.castVote(req.body.candidate, req.body.address)
    .then((hash) => {
      res.status(201).send(hash);
    })
    .catch((err) => {
      res.status(500).send('There was an error when creating the blockchain vote');
    });
}

const contract = (req, res) => {
  const options = req.body.options;
  blockchain.createContract(options)
    .then((contract) => {
      res.status(201).send(contract);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error when creating the blockchain vote');
    });
}

const createpoll = (req, res) => {
  dbHelper.createPoll(req.session.orgId, req.body)
    .then((newPoll) => {
      const optionArray = [];
      const pollOpts = req.body.pollOptions;
      for (let i = 0; i < pollOpts.length; i++) {
        optionArray.push(dbHelper.createOption(newPoll.dataValues.id, pollOpts[i]));
      }
      return Promise.all(optionArray);
    })
    .then((results) => {
      res.status(201).send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in creating a new poll');
    });
}

const getpolls = (req, res) => {
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
      res.status(500).send('Error retrieving polls from server');
    });
}

const emailcodes = (req, res) => {
  console.log('inside email codes')
  let emails = JSON.parse(req.body.emails);
  let pollId = req.body.pollId;
  let ballotName = req.body.ballotName;
  let start = req.body.start;
  let end = req.body.end;
  mailer.sendEmailCodes(emails, pollId, ballotName, start, end)
  .then(result => {
      res.status(201).send(result);
    })
  .catch(err => {
      res.status(500).send('There was an error in sending voter Id');
    });
}

const endpoll = (req, res) => {
  console.log(req.body)
  dbHelper.endPoll(req.body.pollId, req.body.pollExpired)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in updating ballot status');
    }); 
}

const forgotpassword = (req, res) => {
  let email = req.body.email;
  let token = helpers.createPassword();
  let expiration = Date.now() + 3600000;
  dbHelper.updateOrgToken(email, token, expiration)
  .then(result => {
    if (result[0] === 0) {
      res.status(500).send('User does not exist')
    } else {
      mailer.sendPasswordReset(email, token)
      .then(result => {
        res.status(201).send(result);
      }).catch(err => {
        res.status(500).send("Error resetting the password")
      })
    }
  })
}

const resettoken = function(req,res) {
  let token = req.params.token;
  dbHelper.verifyToken(token)
  .then(result => {
    res.redirect(url.format({
      pathname:"/reset",
      query: {
        'token': token,
      }
    }))
  }).catch(err => {
    res.redirect(url.format({
      pathname:"/reset",
      query: {
        'token': 'error'
      }
    }))
  })
}

const resetpassword = (req, res) => {
  let token = req.body.token;
  let password = req.body.password;
  bcrypt.hash(password, 10)
  .then(hash => {
    dbHelper.updatePassword(token, hash)
    .then(result => {
      res.status(201).send();
    }).catch(err => {
      res.status(500).send(err);
    })
  })
}

const wildcard = (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
}

exports.login = login;
exports.signup = signup;
exports.password = password;
exports.logout = logout;
exports.voter = voter;
exports.poll = poll;
exports.voteresult = voteresult;
exports.blockchainvote = blockchainvote;
exports.contract = contract;
exports.createpoll = createpoll;
exports.getpolls = getpolls;
exports.emailcodes = emailcodes;
exports.endpoll = endpoll;
exports.forgotpassword = forgotpassword;
exports.resettoken = resettoken;
exports.resetpassword = resetpassword;
exports.wildcard = wildcard;


