// These files tell how the api will interact with GET / POST requests.
import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';

const userRoutes = express.Router();


userRoutes.post('', (req, res) => {

  const {username, password} = req.body;
  User.countDocuments({username: req.body.username}, (err, num_docs) => {
    try {
      if (num_docs > 0) {
        throw new Error("Email is already registered in database");
      }

      const newUser = new User(req.body);
      newUser.username = username;
      newUser.password = newUser.generatePassword(password);
      newUser.save(function (err, user) {

        if (err) throw new Error(err);

        res.send({userID: newUser.id, username: newUser.username})
      });
    } catch (err) {
      res.status(400).send(parseError(err));
    }
  });

});


export default userRoutes;
