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



  exports.sendPasswordReset = sendPasswordReset;
