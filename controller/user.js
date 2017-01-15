var User = require('../model/user');

exports.postUser = function(req, res) {
  var user = new User(req.body.username, req.body.password, req.body.university);
  user.save(function(err) {
    if (err) return res.send(err);
    res.json({ message: "new user is added"});
  });
}
