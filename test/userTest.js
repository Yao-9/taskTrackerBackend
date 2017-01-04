var assert = require('assert');
var User = require('../model/user');
var bcrypt = require('bcrypt-nodejs');

describe('User', function() {
  describe('findUser', function() {
    it('should return a User for given username', function(done) {
      var user = new User("testusername", "testpassword", "testUniversity");
      user.save(function(err) {
        if (err) console.log(err);
      });
      User.findByUsername("testusername", function(err, user) {
        if (err) {
          done(err)
        } else {
          assert.equal(user.username, "testusername");
          assert(bcrypt.compareSync("testpassword", user.password));
          assert.equal(user.university, "testUniversity");
          done();
        }
      });
    });
  });
});
