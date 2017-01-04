var bcrypt = require('bcrypt-nodejs');
var AWS = require('aws-sdk');
AWS.config.update({
    region: "us-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

function User(username, password, university) {
  this.username = username;
  this.password = password;
  this.university = university;
}

User.prototype.save = function (callback) {
  var params = {
    TableName:"User",
    Item: {
      "username": this.username,
      "password": bcrypt.hashSync(this.password),
      "university": this.university
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.log(err.stack);
      callback(err);
    } else {
      callback();
    }
  })
};

User.findByUsername = function(username, callback) {
  var params = {
    TableName : "User",
    Key:{
      "username": username
    }
  };

  docClient.get(params, function(err, data) {
    if (err) {
      console.error("Query error:", JSON.stringify(err, null, 2))
      callback(err, null)
    } else {
      var user = new User(data.Item.username,
        data.Item.password, data.Item.university);
      callback(null, user);
    }
  });
};

User.prototype.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  })
}

module.exports = User;
