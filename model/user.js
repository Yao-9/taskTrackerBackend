var bcrypt = require('bcrypt-nodejs');
var AWS = require('aws-sdk');

AWS.config.update({
    region: "us-west-2"
});
//TODO: Use configuration file to determine region


function UserNameAlreadyTakenError(message) {
  this.name = "UserNameAlreadyTakenError";
  this.message = message
}

UserNameAlreadyTakenError.prototype = new Error()

function putUser(docClient, user, callback) {
  var putParams = {
    TableName:"User",
    Item: {
      "username": this.username,
      "password": bcrypt.hashSync(this.password),
      "university": this.university
    }
  };

  docClient.put(putParams, function(err, data) {
    if (err) {
      console.log(err.stack);
      callback(err);
    } else {
      callback();
    }
  });
}

var docClient = new AWS.DynamoDB.DocumentClient();

function User(username, password, university) {
  this.username = username;
  this.password = password;
  this.university = university;
}

User.prototype.save = function (callback) {
  var getParam = {
    TableName: "User",
    Key: {
      "username": this.username
    }
  };

  User.findByUsername(this.username, function(err, data) {
    if (err) {
      console.log(err.stack);
      callback(err);
      return;
    } else {
      if (Object.keys(data).length !== 0) {
        callback(new UserNameAlreadyTakenError("Username is already been taken"));
        return;
      } else {
        putUser(docClient, this, callback);
      }
    }
  })
}

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
module.exposts = UserNameAlreadyTakenError
