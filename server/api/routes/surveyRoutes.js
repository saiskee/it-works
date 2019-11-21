import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import Question from '../models/QuestionSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';
import {parseNewTemplateIntoQuestions,  parseExistingTemplateIntoQuestions} from "./util/helpers";

const surveyRoutes = express.Router();

const SurveyStatus = {
    UNFINISHED: "Unfinished",
    FINISHED: "Finished",
    EXPIRED: "Expired"
};

//Route for employee to get all surveys that are assigned to them
surveyRoutes.get('/surveys', (req, res) => {
      const {userId} = req.session.user;

      User.findOne({_id: mongoose.Types.ObjectId(userId)}, (err, user) => {
        try {
          if (err) throw new Error(err);

          Survey.find({
              _id: {$in: user.surveys_assigned.map((survey_object) => (mongoose.Types.ObjectId(survey_object.survey_id))) }
          }, (err, surveys) => {
            // Append all the statuses to the surveys.
            let surveys_with_statuses = surveys.map((survey_object) => {
                let user_survey_object = user.surveys_assigned.find((user_survey) => (mongoose.Types.ObjectId(user_survey.survey_id).equals(survey_object._id)));
                // Return the survey with the status appended.
                let final_object = {survey: survey_object, survey_status: user_survey_object.survey_status};
                return final_object;
            });
            res.send({surveys: surveys_with_statuses});
          });
        } catch (err) {
          res.status(400).send(parseError(err));
        }
      })
    }
);

// Route for employee to get survey data to take survey
surveyRoutes.get('/:surveyId', async (req, res) => {
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
          if (survey_entry.survey_status === SurveyStatus.FINISHED || survey_entry.survey_status === SurveyStatus.EXPIRED) {
            throw new Error("Survey already answered or no longer open.");
          }

          Survey.findOne({_id: surveyId}, async (err, survey) => {
            try {
              if (err) throw new Error(err);
              if (!survey) throw new Error('Invalid Survey');
              survey = await parseExistingTemplateIntoQuestions(survey);
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

// Route for Employee to send survey responses to
surveyRoutes.post('/:surveyId', async(req, res) => {
  const {userId} = req.session.user;
  const user = await User.findOne({_id: userId});
  const surveyId = req.params.surveyId;
  const answers = req.body;
  const survey_entry = user.surveys_assigned.find((entry) => entry.survey_id.equals(mongoose.Types.ObjectId(surveyId)));
  if(survey_entry !== undefined && survey_entry.survey_status === SurveyStatus.UNFINISHED) {
    for (const answer_id in answers){
      survey_entry.survey_status = SurveyStatus.FINISHED;
      user.save();
      const question = await Question.findOne({_id: answer_id});
      const answerObj = {question_id: answer_id, answer: answers[answer_id], survey_id: surveyId};
      question.survey_responses.push(answerObj);
      let question1 = await question.save();
      
    }
  }
});

// Route for Manager to create a new survey
surveyRoutes.post('', async (req, res) => {
  let surveyTemplate = req.body;
  // Right now, the survey is assigned to the user who creates the survey
  // TODO: Assign surveys to other users during survey creation
  const {userId} = req.session.user;

  surveyTemplate = await parseNewTemplateIntoQuestions(surveyTemplate, userId);
  const newSurvey = new Survey({
    survey_template: surveyTemplate,
    author: mongoose.Types.ObjectId(userId)
  });

  await newSurvey.save((err, survey) => {
    try{
      if (err) throw new Error(err);

      User.findOne({ _id: userId }, (err, user) => {
        user.surveys_assigned.push({survey_id: survey.id, survey_status: SurveyStatus.UNFINISHED});
        user.save();
      });
    }

    catch(err){
      res.status(400).send(parseError(err));
    }

  })
});




export default surveyRoutes;
