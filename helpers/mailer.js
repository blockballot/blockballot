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
        subject: 'Link to reset your password', 
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




// const sendPasswordReset = function(email, token) {
//   return new Promise(function(resolve, reject) {
//     let mailPasswordOptions = {
//       from: '"BlockBallot" <blockballot@gmail.com>', 
//       to: `${email}`, 
//       subject: 'Link to reset your password', 
//       text: 'You are receiving this email because you have requested to reset your password.' + '\n' +
//       'Please click on the link below to complete the process.' + '\n' +
//       'http://localhost:3000' + '/reset/' + token + '\n' +
//       'If you did not request this, please ignore this message and your password will remain unchanged.'
//     };  

//     transporter.sendMail(mailPasswordOptions, (error, info) => {
//       if (error) {
//         reject(error);
//       } else {
//         console.log('no error');
//         resolve(info);
//       }
//     });
//   })
// }

const sendEmailCodes = (emails, pollId) => {
  return new Promise(function(resolve, reject) {
    emails.forEach((recipient) => {
      let code = helpers.createUniqueId();

      let emailCodeOptions = {
        from: '"BlockBallot" <blockballot@gmail.com>', 
        to: `${recipient}`, 
        subject: 'Your voting code', 
        html: '<p>Visit localhost:3000/voter and enter the code below to submit your vote.</p><p>Your unique code is <b>' + `${code}` + '</b></p>' 
      };

      dbHelper.saveVoterID(code, pollId);
      transporter.sendMail(emailCodeOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    })
  })
}

exports.sendPasswordReset = sendPasswordReset;
exports.sendEmailCodes = sendEmailCodes;
