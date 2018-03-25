const nodemailer = require('nodemailer');
require('dotenv').load();

let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'blockballot@gmail.com', // generated ethereal user
            pass: account.pass // generated ethereal password
        }
    });