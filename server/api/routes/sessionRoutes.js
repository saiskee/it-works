import express from 'express';
import User from '../models/UserSchema';
import 'babel-polyfill';
import {parseError, sessionizeUser} from "../../util/helper";
import {SESS_NAME} from "../../config";

const sessionRoutes = express.Router();
sessionRoutes.post("", async (req, res) => {

  const {username, password} = req.body;
  User.findOne({username}, (err, user) => { // same as {username : username}
    try {
      if (user && user.validatePassword(password)) {
        const sessionUser = sessionizeUser(user);
        req.session.user = sessionUser;
        res.send({valid: true, ...sessionUser});
        console.log(JSON.stringify(sessionUser));
      } else {
        throw new Error('Invalid Login Credentials');
      }
    } catch (err) {
      res.status(401).send(parseError(err));
    }
  });

});

sessionRoutes.delete("", ({session}, res) => {
  try {
    const user = session.user;
    if (user) {
      session.destroy(err => {
        if (err) throw (err);
        res.clearCookie(SESS_NAME);
        res.send(user);
      });
    } else {
      throw new Error('Something went wrong');
    }
  } catch (err) {
    res.status(422).send(parseError(err));
  }
});

sessionRoutes.get("", ({session: {user}}, res) => {
  res.send({user});
});

export default sessionRoutes;