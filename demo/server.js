var express = require('express'), // Import Express
  app = express(), // Init Express
  port = process.env.PORT || 3000, // Either the port we were assigned, or 3000
  mongoose = require('mongoose'),
  Login = require('./api/models/restModel'),
  cors = require('cors'),
  body_parser = require('body-parser');

app.use(cors()); // Allow all Cross-Domain traffic to see this server. On actual project might want to limit to only project domain.

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mockrestdb');

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json())

var routes = require('./api/routes/restRoutes');
routes(app);

app.listen(port);
console.log('REST API server running on: ' + port);


