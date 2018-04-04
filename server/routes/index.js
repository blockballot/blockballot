const auth = require('./auth.js');
const blockchain = require('./blockchain.js');
const mailer = require('./mailer.js');
const poll = require('./poll.js')
const voter = require('./voter.js')

module.exports = {
  auth: auth,
  blockchain: blockchain,
  mailer: mailer,
  poll: poll,
  voter: voter
};
