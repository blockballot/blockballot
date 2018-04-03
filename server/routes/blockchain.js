const blockchain = require('../../helpers/blockchainHelpers.js');

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

module.exports = {
  blockchainvote: blockchainvote,
  contract: contract
};
