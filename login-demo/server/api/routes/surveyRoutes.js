import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import Question from '../models/QuestionSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';
import {parseNewTemplateIntoQuestions,  parseExistingTemplateIntoQuestions} from "./util/helpers";

const surveyRoutes = express.Router();

surveyRoutes.get('/surveys', (req, res) => {
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

surveyRoutes.get('/:surveyId', async (req, res) => {
      const {userId} = req.session.user;
      const {surveyId} = req.params;
      User.findOne({_id: userId}, (err, user) => {
        try{
          if (err) throw new Error(err);
          if (!user) throw new Error("Please try logging back in!");
          if (!user.surveys_assigned.includes(surveyId)){
            throw new Error("This survey was not assigned to you, or does not exist.");
          }

          Survey.findOne({_id: surveyId}, async (err, survey) => {
            try {
              if (err) throw new Error(err);
              if (!survey) throw new Error('Invalid Survey');

              survey = await parseExistingTemplateIntoQuestions(survey);
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

surveyRoutes.post('/:surveyId', async(req, res) => {
  const {userId} = req.session.user;
  const user = await User.findOne({_id: userId});
  const surveyId = req.params.surveyId;
  const answers = req.body;
  if(user.surveys_assigned.includes(surveyId)){ //also add check to make sure that survey hasn't been completed before
    for (const answer_id in answers){
      const question = await Question.findOne({_id: answer_id});
      const answerObj = {question_id: answer_id, answer: answers[answer_id], survey_id: surveyId};
      question.survey_responses.push(answerObj);
      let question1 = await question.save();
      console.log(question1);
    }
  }
})

surveyRoutes.post('', async (req, res) => {
  let surveyTemplate = req.body;
  const {userId} = req.session.user;
  surveyTemplate = await parseNewTemplateIntoQuestions(surveyTemplate, userId);
  const newSurvey = new Survey({survey_template: surveyTemplate});
  await newSurvey.save((err, survey) => {
    try{

      if (err) throw new Error(err);

      User.findOne({}, (err, user) => {
        user.surveys_assigned.push(survey.id);
        user.save();
      });

    }

    catch(err){
      res.status(400).send(parseError(err));
    }

  })
});


export default surveyRoutes;