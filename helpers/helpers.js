const SHA256 = require('crypto-js').SHA256;
const rn = require('random-number');
const rw = require('random-words');

const createPassword = () => {
  const string = rn() + rw();
  const pw = SHA256(string).toString();
  return pw;
};

const createUniqueId = () => {
  const string = rn() + rw();
  const pw = SHA256(string).toString();
  return pw.substring(0, 10);
};

const formatDate = (string) => {
  if (string === null) {
    return null;
  }
  const date = new Date(string);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const fullDate = `${month}/${day}/${year}`;

  let period = 'am';
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours === 0 || hours === 24) {
    hours = '12';
    period = 'am';
  } else if (hours === 12) {
    period = 'pm';
  } else if (hours > 12) {
    hours -= 12;
    period = 'pm';
  }
  const fullTime = `${hours}:${minutes} ${period}`;

  return `${fullDate} at ${fullTime}`;
}

module.exports = {
  createUniqueId: createUniqueId,
  createPassword: createPassword,
  formatDate: formatDate
}
