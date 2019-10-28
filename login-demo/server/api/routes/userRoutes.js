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

userRoutes.get('/surveys', (req, res) => {
      const {userId} = req.body;
      User.findOne({id: userId}, (err, user) => {
        try{
          if (err) throw new Error(err);
          Survey.find({
            _id: { $in: user.surveys_assigned.map((survey) => (mongoose.Types.ObjectId(survey)))}
          }, (err, surveys) => {
            res.send({surveys: surveys});
          });
        }catch (err) {
          res.status(400).send(parseError(err));
        }
      })
    }
)

userRoutes.post('/survey', (req, res) => {
      Survey.find({}, (err, survey) => {
        if (err) {
          res.error(err)
        } else {
          res.json(survey[0].survey_data)
        }

      })
    }
);
export default userRoutes;
