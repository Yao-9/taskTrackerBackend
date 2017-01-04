var express = require('express');
var userController = require('./controller/user.js');
var authController = require('./controller/auth.js');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');


// Use the body-parser package in our application
// body-parser is a component automatically convert request body into hashmap under req.body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//initialize the passport for authentication
app.use(passport.initialize());

var router = express.Router();

router.route('/users')
    .post(userController.postUser);

router.route('/testing')
  .get(authController.isAuthenticated, function(req, res) {
    res.send("test succeeded");
  });

app.use('/', router);

app.listen(3002, function() {
  console.log('I am listening');
});
