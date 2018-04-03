const db = require('../database/index.js');
const dbHelper = require('../database/dbHelpers.js');
const path = require('path');

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

//refactor to not use db
const poll = (req, res) => {
  db.Option.findAll({
    where: { pollId: req.body.pollId },
    include: [db.Poll]
  })
    .then((option) => {
      if (!option) {
        res.status(500).send('There was an error. Please try again later.');
      } else {
        console.log('OPTION', option)
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

const wildcard = (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
}

exports.voter = voter;
exports.poll = poll;
exports.voteresult = voteresult;
exports.createpoll = createpoll;
exports.getpolls = getpolls;
exports.endpoll = endpoll;
exports.wildcard = wildcard;

