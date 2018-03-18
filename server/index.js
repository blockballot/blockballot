require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const auth = require('../helpers/authHelpers.js');
const db = require('../database/index.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'secrettoken',
  resave: false,
  saveUninitialized: true
}));
















app.post('/api/Voter', (req, res) => {
  console.log('xxxxx')
  console.log(req)
  res.send('Hello World')
})


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));

module.exports = app;