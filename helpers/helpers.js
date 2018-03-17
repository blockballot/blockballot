const SHA256 = require('crypto-js/SHA256');
const rn = require('random-number');
const rw = require('random-words');

let createPassword = () => {
  let string = rn() + rw();
  console.log(string);
  let pw = SHA256(string).toString();
  return pw;
};

exports.createPassword = createPassword;
