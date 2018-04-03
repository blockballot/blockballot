const dbHelpers = require('../database/dbHelpers.js');
const path = require('path');

const voter = (req, res) => {
  dbHelpers.retrieveCode(req.body.uniqueId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Invalid unique ID. Please input a valid unique ID.');
    });
}

const poll = (req, res) => {
  let pollId = req.body.pollId;
  dbHelpers.findOptions(pollId)
    .then((options) => {
      if (!options) {
        res.status(500).send('There was an error. Please try again later.');
      } else {
        res.status(200).send(options);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error. Please try again later.');
    });
}

const voteresult = (req, res) => {
  dbHelpers.submitVote(req.body.voteHash, req.body.optionId, req.body.keyId)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('There was an error in submitting your vote');
    });
}

const createpoll = (req, res) => {
  dbHelpers.createPoll(req.session.orgId, req.body)
    .then((newPoll) => {
      const optionArray = [];
      const pollOpts = req.body.pollOptions;
      for (let i = 0; i < pollOpts.length; i++) {
        optionArray.push(dbHelpers.createOption(newPoll.dataValues.id, pollOpts[i]));
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
  dbHelpers.retrievePolls(req.session.orgId)
    .then((polls) => {
      const promiseArr = [];
      for (let i = 0; i < polls.length; i++) {
        promiseArr.push(dbHelpers.bundlePollVotes(polls[i]));
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
  dbHelpers.endPoll(req.body.pollId, req.body.pollExpired)
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

module.exports = {
  voter: voter,
  poll: poll,
  voteresult: voteresult,
  createpoll: createpoll,
  getpolls: getpolls,
  endpoll: endpoll,
  wildcard: wildcard
}

