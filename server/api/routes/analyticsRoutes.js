import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import Question from '../models/QuestionSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';
import {parseExistingTemplateIntoQuestionsIncludeResponses} from "./util/helpers";


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
        } catch (err) {
          res.status(400).send(parseError(err));
        }
      });
    }
);

analyticsRoutes.get('/survey/:surveyId', async (req, res) => {
      // TODO: Make sure user is a valid field, if not, throw error
      const {userId} = req.session.user;
      const {surveyId} = req.params;


      Survey.findOne({_id: surveyId}, async (err, survey) => {
        try {
          if (err) throw new Error(err);
          if (!survey) throw new Error('Invalid Survey');
          if (survey.author != userId) throw new Error('This Survey was not created by you');
          survey = await parseExistingTemplateIntoQuestionsIncludeResponses(survey);
          res.send({survey: survey});
          console.log(JSON.stringify(survey));
        } catch (err) {
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
    try {
      if (err) throw new Error(err);
      res.send(question.survey_reponses);
    } catch (err) {
      res.status(400).send(parseError(err));
    }
  })


});


export default analyticsRoutes;
