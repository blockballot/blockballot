const SHA256 = require('crypto-js').SHA256;
const rn = require('random-number');
const rw = require('random-words');

let createPassword = () => {
  let string = rn() + rw();
  let pw = SHA256(string).toString();
  return pw;
};

let createUniqueId = () => {
  let string = rn() + rw();
  let pw = SHA256(string).toString();
  return pw.substring(0, 10);
};

module.exports = {
  createUniqueId: createUniqueId,
  createPassword: createPassword
}
