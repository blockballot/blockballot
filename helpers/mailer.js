const nodemailer = require('nodemailer');
const env = require('dotenv').config();

var sendPasswordReset = function(email) {
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
      return console.log(error);
    } else {
      console.log('email sent');
    }
  });
}



  exports.sendPasswordReset = sendPasswordReset;
