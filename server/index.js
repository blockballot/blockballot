const env = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const routes = require('./routes.js')

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

app.post('/login', routes.login);

app.post('/signup', routes.signup);

app.get('/password', routes.password);

app.get('/logout', routes.logout);

app.post('/voter', routes.voter);

app.post('/poll', routes.poll);

app.post('/voteresult', routes.voteresult);

app.post('/blockchainvote', routes.blockchainvote);

app.post('/contract', routes.contract);

app.post('/createpoll', routes.createpoll);

app.get('/getpolls', routes.getpolls);

app.post('/emailcodes', routes.emailcodes);

app.put('/endpoll', routes.endpoll);

app.post('/forgotpassword', routes.forgotpassword);

app.get('/reset/:token', routes.resettoken);

app.post('/resetpassword', routes.resetpassword)

app.get('/*', routes.wildcard);

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;
