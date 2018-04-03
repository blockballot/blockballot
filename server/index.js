const env = require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes.js')
const authRoutes = require('./authRoutes.js');
const mailerRoutes = require('./mailerRoutes.js');
const blockchainRoutes = require('./blockchainRoutes.js');

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

//authroutes
app.post('/login', authRoutes.login);
app.post('/signup', authRoutes.signup);
app.get('/password', authRoutes.password);
app.get('/logout', authRoutes.logout);
app.get('/reset/:token', authRoutes.resettoken);
app.post('/resetpassword', authRoutes.resetpassword)

//mailer routes
app.post('/forgotpassword', mailerRoutes.forgotpassword);
app.post('/emailcodes', mailerRoutes.emailcodes);

//blockchain routes
app.post('/blockchainvote', blockchainRoutes.blockchainvote);
app.post('/contract', blockchainRoutes.contract);

//general routes
app.post('/createpoll', routes.createpoll);
app.get('/getpolls', routes.getpolls);
app.put('/endpoll', routes.endpoll);
app.post('/poll', routes.poll);
app.post('/voter', routes.voter);
app.post('/voteresult', routes.voteresult);
app.get('/*', routes.wildcard);

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;
