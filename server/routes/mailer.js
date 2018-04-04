const dbHelpers = require('../../database/dbHelpers.js');
const mailerHelpers = require('../../helpers/mailerHelpers.js');
const helpers = require('../../helpers/helpers.js')

const emailcodes = (req, res) => {
  let emails = JSON.parse(req.body.emails);
  mailerHelpers.sendEmailCodes(emails, req.body.pollId, req.body.ballotName, req.body.start, req.body.end, req.body.orgName)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(500).send('There was an error in sending voter Id');
    });
}

const forgotpassword = (req, res) => {
  let email = req.body.email;
  let token = helpers.createPassword();
  let expiration = Date.now() + 3600000;
  dbHelpers.updateOrgToken(email, token, expiration)
    .then((result) => {
      if (result[0] === 0) {
        res.status(500).send('User does not exist')
      } else {
        mailerHelpers.sendPasswordReset(email, token)
        .then((result) => {
          res.status(201).send(result);
        }).catch((err) => {
          res.status(500).send("Error resetting the password")
        })
      }
    })
}

module.exports = {
  emailcodes: emailcodes,
  forgotpassword: forgotpassword
};