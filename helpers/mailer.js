const nodemailer = require('nodemailer');
const env = require('dotenv').config();

var sendPasswordReset = function(email, callback) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false, 
    auth: {
        user: 'blockballot@gmail.com', 
        pass: process.env.PASSWORD 
    }
  });

  let mailOptions = {
      from: '"BlockBallot" <blockballot@gmail.com>', 
      to: `${email}`, 
      subject: 'Link to reset your password', 
      html: '<b>Click the link below to reset your password.</b>' 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    } else {
      console.log('no error');
      callback(null, info);
    }
  });
}

var sendEmailCodes = function(emails, callback) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 588,
    secure: false, 
    auth: {
        user: 'blockballot@gmail.com', 
        pass: process.env.PASSWORD 
    }
  });

  let mailOptions = {
      from: '"BlockBallot" <blockballot@gmail.com>', 
      to: emails, 
      subject: 'Your voting code', 
      html: '<b>Visit blockballot.com/voters and enter the code below to submit your vote.</b>' 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
    } else {
      callback(null, info);
    }
  });
}


  exports.sendPasswordReset = sendPasswordReset;
  exports.sendEmailCodes = sendEmailCodes;
