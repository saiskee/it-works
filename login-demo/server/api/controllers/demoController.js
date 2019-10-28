'use strict';

var mongoose = require('mongoose'),
  login = mongoose.model('login');

exports.auth = function(req, res) {

  login.find({ username: req.body.username}, function(err, docs) {
    if (err) {
      res.send(err);
    } else if (docs[0] != undefined && docs[0].password == req.body.password) {
      res.json({ valid: true, test: req.body });
    } else {
      res.json({ valid: false, test: req.body });
    }
  });
}

exports.create_user = function(req, res) {
  var user = new login(req.body);
  login.count({username: req.body.username}, (err, num_docs) => {
    console.log(num_docs)
    if (num_docs > 0){
      res.json({valid: false, data: req.body});
      return;
    }
    user.save(function(err, user) {
      if (err)
        res.send(err)
      res.json({valid: true, data: req.body})
    });
  });
  
}
