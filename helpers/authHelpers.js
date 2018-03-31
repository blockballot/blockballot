const bcrypt = require('bcrypt');

const isLoggedIn = (req) => {
  return req.session ? !!req.session.user : false;
};

const checkUser = (req, res, next) => {
  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

const createSession = (req, res, newUser) => {
  return req.session.regenerate(() => {
    res.cookie('loggedIn', 'true', { maxAge: 60 * 60 * 1000 });
    res.cookie('username', newUser.dataValues.orgName, { maxAge: 60 * 60 * 1000 });
    req.session.user = newUser.dataValues.orgName;
    req.session.orgId = newUser.dataValues.id;
    res.status(200).send();
  });
};

const comparePassword = (attemptedPassword, org, callback) => {
  const existingPassword = org.orgPassword;
  bcrypt.compare(attemptedPassword, existingPassword, (err, isMatch) => {
    callback(isMatch);
  });
}

module.exports = {
  isLoggedIn: isLoggedIn,
  checkUser: checkUser,
  createSession: createSession,
  comparePassword: comparePassword
};
