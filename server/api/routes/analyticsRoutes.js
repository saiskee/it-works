import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import Question from '../models/QuestionSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';
import {parseExistingTemplateIntoQuestionsIncludeResponses} from "./util/helpers";
import surveyRoutes from "./surveyRoutes";

const analyticsRoutes = express.Router();

// Route for manager to get all surveys that they authored
analyticsRoutes.get('/surveys', async (req, res) => {
      const {userId} = req.session.user;

        Survey.find({
          author: mongoose.Types.ObjectId(userId)
        }, (err, surveys) => {
          try {
            if (err) throw new Error(err);
            res.send({surveys: surveys});
          }
          catch (err) {
            res.status(400).send(parseError(err));
          }
        });


    }
);

analyticsRoutes.get('/survey/:surveyId', async (req, res) => {
      const {userId} = req.session.user;
      const {surveyId} = req.params;
      User.findOne({_id: userId}, (err, user) => {
        try{
          if (err) throw new Error(err);
          if (!user) throw new Error("Please try logging back in!");
          const survey_entry = user.surveys_assigned.find((survey_entry) => (survey_entry.survey_id.equals(mongoose.Types.ObjectId(surveyId))));
          if (survey_entry === undefined){
            throw new Error("This survey was not assigned to you, or does not exist.");
          }


          Survey.findOne({_id: surveyId}, async (err, survey) => {
            try {
              if (err) throw new Error(err);
              if (!survey) throw new Error('Invalid Survey');
              survey = await parseExistingTemplateIntoQuestionsIncludeResponses(survey);
              res.send({survey: survey});
            } catch (err) {
              res.status(400).send(parseError(err));
            }
          });
        }
        catch(err){
          res.status(400).send(parseError(err));
        }
      });

    }
);

analyticsRoutes.get('/responses/:questionId', async (req, res) => {
  const {userId} = req.session.user;
  Question.find({
    _id: req.params.questionId,
    author: mongoose.Types.ObjectId(userId)
  }, (err, question) => {
    try{
      if (err) throw new Error(err);
      res.send(question.survey_reponses);
    }catch (err){
      res.status(400).send(parseError(err));
    }
  })


});


export default analyticsRoutes;
