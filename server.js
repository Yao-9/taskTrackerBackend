var express = require('express');
var userController = require('./controller/user.js');
var authController = require('./controller/auth.js');
var bodyParser = require('body-parser');
var app = express();
var passport = require('passport');
const https = require('https');
const fs = require('fs');

// Use the body-parser package in our application
// body-parser is a component automatically convert request body into hashmap under req.body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//initialize the passport for authentication
app.use(passport.initialize());

var router = express.Router();

router.route('/user')
    .post(userController.postUser)

router.route('/user/:username')
    .get(authController.isAuthenticated, userController.getUser)

router.route('/testing')
  .get(authController.isAuthenticated, function(req, res) {
    res.send("test succeeded");
  });

app.use('/', router);

app.listen(3002, function() {
  console.log('I am listening');
});

const options = {
  key: fs.readFileSync('/Users/Yao/.cert/server_cert/domain.key'),
  cert: fs.readFileSync('/Users/Yao/.cert/server_cert/domain.crt')
};

https.createServer(options, app).listen(3003);
