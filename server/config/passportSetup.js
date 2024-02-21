const LocalStrategy = require('passport-local').Strategy;
// const YourModel = require('./your-path');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', session: true, passReqToCallback: false },
    async (email, password, done) => {
      // your login logic
      // return done(*error*, *account found*, *option information*);
    }
  ));

  passport.serializeUser((user, done) => {
    // done(null, *own unique identifier*);
  });

  // passport.deserializeUser((*identifier*, done) => {
    // YourModel.findOne({*identifier*}).then((err, user) => {
      // done(user, err);
    // });
  // });
};