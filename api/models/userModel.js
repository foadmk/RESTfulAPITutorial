'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    Required: 'Kindly enter the username'
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    Required: 'Kindly enter the password'
  }
});


module.exports = mongoose.model('User', UserSchema);
