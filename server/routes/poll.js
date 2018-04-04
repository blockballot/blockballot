const dbHelpers = require('../../database/dbHelpers.js');
const path = require('path');
const helpers = require('../../helpers/helpers.js')

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

const deletepoll = (req, res) => {
  dbHelpers.deletePoll(req.query.pollId)
    .then((result) => {
      res.sendStatus(200).send(result);
    })
    .catch((err) => {
      res.status(500).send('Unable to delete ballot')
    })
}

const getpolls = (req, res) => {
  console.log(req.session);
  console.log('ORG ID', req.session.orgId)

  dbHelpers.retrievePolls(req.session.orgId)
    .then((polls) => {
      const promiseArr = [];
      for (let i = 0; i < polls.length; i++) {
        let poll = polls[i];
        let pollStart = helpers.formatDate(poll.pollTimeStart);
        let pollEnd = helpers.formatDate(poll.pollTimeEnd);
        poll.pollTimeStart = pollStart;
        poll.pollTimeEnd = pollEnd;
        promiseArr.push(dbHelpers.bundlePollVotes(poll));
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
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
}

module.exports = {
  createpoll: createpoll,
  deletepoll: deletepoll,
  getpolls: getpolls,
  endpoll: endpoll,
  wildcard: wildcard
};
