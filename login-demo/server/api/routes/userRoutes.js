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
      const {userId} = req.session.user;
      User.findOne({_id: mongoose.Types.ObjectId(userId)}, (err, user) => {
        try {
          if (err) throw new Error(err);
          Survey.find({
            _id: {$in: user.surveys_assigned.map((survey) => (mongoose.Types.ObjectId(survey)))}
          }, (err, surveys) => {
            res.send({surveys: surveys});
          });
        } catch (err) {
          res.status(400).send(parseError(err));
        }
      })
    }
)

userRoutes.get('/survey/:surveyId', (req, res) => {
  const {userId} = req.session.user;
  const {surveyId} = req.params;
      User.findOne({_id: userId}, (err, user) => {
        try{
          if (err) throw new Error(err);
          if (!user) throw new Error("Please try logging back in!");
          if (!user.surveys_assigned.includes(surveyId)){
            throw new Error("This survey was not assigned to you, or does not exist.");
          }

          Survey.findOne({_id: surveyId}, (err, survey) => {
            try {
              if (err) throw new Error(err);
              if (!survey) throw new Error('Invalid Survey');
              res.send({survey: survey})
            } catch (err) {
              res.status(400).send(parseError(err));
            }

          })

        }
        catch(err){
          res.status(400).send(parseError(err));
        }
      });

    }
);

userRoutes.post('/survey', (req, res) => {
  const surveyTemplate = req.body;
  const newSurvey = new Survey({survey_template: surveyTemplate});
  newSurvey.save((err, survey) => {
    try{
      if (err) throw new Error(err);

      res.send({surveyId: survey.id});
    }
    catch(err){
      res.status(400).send(parseError(err));
    }

  })
});

export default userRoutes;
