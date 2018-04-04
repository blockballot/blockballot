const env = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js')

const app = express();

app.use(express.static(`${__dirname  }/../client/dist`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secrettoken',
  resave: false,
  saveUninitialized: true
}));

//auth routes
app.post('/login', routes.auth.login);
app.post('/signup', routes.auth.signup);
app.get('/password', routes.auth.password);
app.get('/logout', routes.auth.logout);
app.get('/reset/:token', routes.auth.resettoken);
app.post('/resetpassword', routes.auth.resetpassword);
app.post('/resetname', routes.auth.resetname);
app.post('/resetemail', routes.auth.resetemail);

//mailer routes
app.post('/forgotpassword', routes.mailer.forgotpassword);
app.post('/emailcodes', routes.mailer.emailcodes);

//blockchain routes
app.post('/blockchainvote', routes.blockchain.blockchainvote);
app.post('/contract', routes.blockchain.contract);

//poll routes
app.post('/polls', routes.poll.createpoll);
app.delete('/polls', routes.poll.deletepoll);
app.get('/polls', routes.poll.getpolls);
app.put('/endpoll', routes.poll.endpoll);
app.get('/*', routes.poll.wildcard);

//voter routes
app.post('/poll', routes.voter.poll);
app.post('/voter', routes.voter.voter);
app.post('/voteresult', routes.voter.voteresult);

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;
