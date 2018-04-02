const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const helpers = require('../helpers/helpers.js');
const dbHelper = require('../database/dbHelpers.js');
const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');


const readHTMLFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, {encoding: 'utf-8'}, function(err, file) {
      if (err) { reject(err) } 
      else { resolve(file) }
    })  
  })
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false, 
  auth: {
      user: 'blockballot@gmail.com', 
      pass: process.env.PASSWORD 
  }
});

const sendPasswordReset = (email, token) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(path.join(__dirname, '../client/src/templates/resetPasswordEmail.html'))
    .then(template => {
      let compiler = handlebars.compile(template);
      let replacements = {
        resetLink: 'http://localhost:3000' + '/reset/' + token
      };
      let templateToSend = compiler(replacements);
      let mailPasswordOptions = {
        from: '"BlockBallot" <blockballot@gmail.com>', 
        to: `${email}`, 
        subject: 'Reset Password', 
        html: templateToSend
      }; 

      transporter.sendMail(mailPasswordOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    }) 
  })
}

const sendEmailCodes = (emails, pollId, ballotName, start, end) => {
  return new Promise((resolve, reject) => {
    readHTMLFile(path.join(__dirname, '../client/src/templates/voterCodeEmail.html'))
    .then(template => {
      let compiler = handlebars.compile(template);

      emails.forEach((recipient) => {
        let code = helpers.createUniqueId();
        let replacements = {
          voterCode: code,
          ballotName: ballotName,
          start: start,
          end: end
        };
        let templateToSend = compiler(replacements);
        let emailCodeOptions = {
          from: '"BlockBallot" <blockballot@gmail.com>', 
          to: `${recipient}`, 
          subject: `Submit a vote for ${ballotName}`, 
          html: templateToSend
        };

        dbHelper.saveVoterID(code, pollId)
        transporter.sendMail(emailCodeOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    }) 
  })
}

exports.sendPasswordReset = sendPasswordReset;
exports.sendEmailCodes = sendEmailCodes;
