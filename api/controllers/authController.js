'use strict';
var mongoose = require('mongoose'),
  User = mongoose.model('User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

exports.register = async function(req, res, next) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  var isuser = await User.find({ 'username': req.body.username }).select({ 'username': 1 }).exec();

  if(isuser.length>0) return res.status(500).send("Usuário existente");

  var user = new User();
  user.username = req.body.username;
  user.password = hashedPassword;

  user.save(function(err, user) {
    if (err) next("There was a problem registering the user.")
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
};

exports.login = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
}
