var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../model/user');

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findByUsername(username, function(err, user) {
      if(err) {return callback(err);}

      if(!user) { return callback(null, false); }
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        if (!isMatch) { return callback(null, false); }

        return callback(null, user);
      })
    });
  }
));

exports.isAuthenticated = passport.authenticate(['basic'], { session: false });