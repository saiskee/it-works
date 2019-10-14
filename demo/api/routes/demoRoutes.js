// These files tell how the api will interact with GET / POST requests.
'use strict';
module.exports = function(app) {
  var login = require('../controllers/demoController.js');

  app.route('/login')
    .post(login.auth);

  app.route('/new_login')
    .post(login.create_user);
}
