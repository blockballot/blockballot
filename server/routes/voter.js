const dbHelpers = require('../../database/dbHelpers.js');
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

module.exports = {
  voter: voter,
  voteresult: voteresult,
  poll: poll
}