/* REQUIRED LIBRARIES */
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import body_parser from 'body-parser';
import session from 'express-session';
import connectStore from 'connect-mongo';
import path from 'path';

import {PORT, NODE_ENV, MONGO_URI, SESS_NAME, SESS_SECRET, SESS_LIFETIME} from './config';

/* INITIALIZE EXPRESS APP */
const app = express();
const MongoStore = connectStore(session);
const  port = PORT || 4000; // Either the port we were assigned, or 4000
app.use(cors()); // Allow all Cross-Domain traffic to see this server. On actual project might want to limit to only project domain.
app.use(morgan("combined", {}));
app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());
app.disable('x-powered-by'); // We don't want hackers to know we are using Express
// Use MongoDB for Persistent session storage
app.use(
    session({
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,

    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'session',
      ttl: parseInt(SESS_LIFETIME) / 1000
    }),

    cookie: {
      sameSite: true,
      secure: NODE_ENV === 'production',
      maxAge: parseInt(SESS_LIFETIME)
    }
  }));

// mongoose.Promise = global.Promise; 
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => { console.log("MONGODB Connected")})

import {userRoutes, sessionRoutes, surveyRoutes, questionRoutes, analyticsRoutes, employeeRoutes} from './api/routes';
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/survey', surveyRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/session', sessionRoutes);
apiRouter.use('/questions', questionRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/employees', employeeRoutes)


app.use(express.static(path.resolve(__dirname + '/../client/build')));
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname + '/../client/build/index.html'));
});
app.listen(port, ()=> {
  console.log('REST API server running on: ' + port);
});



