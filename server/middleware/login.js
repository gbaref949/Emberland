const passport = require('passport');

function login(req, res) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })(req, res);
}

module.exports = login;