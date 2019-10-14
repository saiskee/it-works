'use strict';

var mongoose = require('mongoose'),
  login = mongoose.model('Login');

exports.auth = function(req, res) {
  login.find({ user_name: req.body.user_name}, function(err, docs) {
    if (err) {
      res.send(err);
    } else if (docs[0] != undefined && docs[0].password == req.body.password) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  });
}

exports.create_user = function(req, res) {
  var user = new login(req.body);
  user.save(function(err, user) {
    if (err)
      res.send(err)
    res.json(user)
  });
}
