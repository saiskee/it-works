import express from 'express';
import Survey from '../models/SurveySchema'
import User from '../models/UserSchema'
import Question from '../models/QuestionSchema'
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';
import {parseNewTemplateIntoQuestions, parseExistingTemplateIntoQuestions} from "./util/helpers";
import {scheduleEmailAlerts} from '../mailer/mailer.js';

const surveyRoutes = express.Router();

const SurveyStatus = {
  UNFINISHED: "Unfinished",
  FINISHED: "Finished",
  EXPIRED: "Expired"
};

/* GET /api/survey/surveys
 * Will return all surveys currently assigned to a user
 */
surveyRoutes.get('/surveys', async (req, res) => {
      const {userId} = req.session.user;

      User.findOne({_id: mongoose.Types.ObjectId(userId)}, (err, user) => {
        try {
          if (err) throw new Error(err);

          Survey.find({
            _id: {$in: user.surveys_assigned.map((survey_object) => (mongoose.Types.ObjectId(survey_object.survey_id)))}
          }, async (err, surveys) => {
            try {
              // Append all the statuses to the surveys.
              let surveys_with_statuses = await Promise.all(surveys.map(async (survey_object) => {
                let user_survey_object = user.surveys_assigned.find((user_survey) => (mongoose.Types.ObjectId(user_survey.survey_id).equals(survey_object._id)));
                // Return the survey with the status appended.
                if (survey_object.expiry_date < (new Date).getTime() && user_survey_object.survey_status !== SurveyStatus.EXPIRED) {
                  user_survey_object.survey_status = SurveyStatus.EXPIRED;
                  await user.save();
                }
                let final_object = {survey: survey_object, survey_status: user_survey_object.survey_status};
                return final_object;
              }));
              res.send({surveys: surveys_with_statuses});
            } catch (err) {
              res.status(400).send(parseError(err));
            }
          });
        } catch (err) {
          res.status(400).send(parseError(err));
        }
      })
    }
);

/* GET /api/survey/:surveyId
* Route for employee to get survey data to take survey
 */
surveyRoutes.get('/:surveyId', async (req, res) => {
      const {userId} = req.session.user;
      const {surveyId} = req.params;
      User.findOne({_id: userId}, (err, user) => {
        try {
          if (err) throw new Error(err);
          if (!user) throw new Error("Please try logging back in!");
          const survey_entry = user.surveys_assigned.find((survey_entry) => (survey_entry.survey_id.equals(mongoose.Types.ObjectId(surveyId))));
          if (survey_entry === undefined) {
            throw new Error("This survey was not assigned to you, or does not exist");
          }
          if (survey_entry.survey_status === SurveyStatus.FINISHED) {
            throw new Error("The Survey has already been answered by you");
          }
          if (survey_entry.survey_status === SurveyStatus.EXPIRED) {
            throw new Error("The Survey has Expired. Please contact your manager if this is an issue");
          }


          Survey.findOne({_id: surveyId}, async (err, survey) => {
            try {
              if (err) throw new Error(err);
              if (!survey) throw new Error('Invalid Survey');
              // Survey is expired
              if (survey.expiry_date < (new Date).getTime()) {
                survey_entry.survey_status = SurveyStatus.EXPIRED;
                await user.save();
                throw new Error("The Survey has Expired. Please contact your manager if this is an issue");
              }
              survey = await parseExistingTemplateIntoQuestions(survey);
              res.send({survey: survey});
            } catch (err) {
              res.status(400).send(parseError(err));
            }
          });
        } catch (err) {
          res.status(400).send(parseError(err));
        }
      });

    }
);

/* POST /api/survey/:surveyId
 * Route for Employee to send survey responses to
 */
surveyRoutes.post('/:surveyId', async (req, res) => {
  const {userId} = req.session.user;
  const {surveyId} = req.params;
  const surveySubmitted = await Survey.findOne({_id: surveyId})
  // Get User that submitted the survey responses
  const user = await User.findOne({_id: userId});
  const answers = req.body;
  // Update Survey Status for that survey in the User's record
  const survey_entry = user.surveys_assigned.find((entry) => entry.survey_id.equals(mongoose.Types.ObjectId(surveyId)));
  if (survey_entry !== undefined && survey_entry.survey_status === SurveyStatus.UNFINISHED) {
    for (const answer_id in answers) {
      survey_entry.survey_status = SurveyStatus.FINISHED;
      user.save();
      // Add survey response to the question's survey responses
      const question = await Question.findOne({_id: answer_id});
      const answerObj = {question_id: answer_id, answer: answers[answer_id], survey_id: surveyId, survey_expiry: surveySubmitted.expiry_date};
      question.survey_responses.push(answerObj);
      question.save();
    }
  }
  // Update Survey Completion Status on Survey Record
  const survey = await Survey.findOne({_id: surveyId});
  const emp_status = survey.assigned_to.find((obj) => obj.employee.equals(userId));
  emp_status.completion_status = SurveyStatus.FINISHED;
  survey.save();
});

// POST /api/survey
// Route for Manager to create a new survey
surveyRoutes.post('', async (req, res) => {
  let {employees, surveyTemplate, openDate, expiryDate, employeeMessage} = req.body;
  console.log(req.session);
  const {userId} = req.session.user;

  // From the survey, create new question records and replace survey template with the object ids of these new records
  surveyTemplate = await parseNewTemplateIntoQuestions(surveyTemplate, userId);
  const newSurvey = new Survey({
    survey_template: surveyTemplate,
    author: mongoose.Types.ObjectId(userId),
    assigned_to: employees.tags.map(emp => ({employee: emp.id, status: 'Unfinished'})),
    start_date: openDate,
    expiry_date: expiryDate
  });
  newSurvey.save((err, survey) => {
    try {
      if (err) throw new Error(err);
      User.find({_id: {$in: employees.tags.map(employee => employee.id)}}, (err, users) => {
        try {
          if (err) throw new Error(err);
          users.forEach(user => {
            user.surveys_assigned.push({
              survey_id: mongoose.Types.ObjectId(survey.id),
              survey_status: SurveyStatus.UNFINISHED
            });
            user.save();
          })
          res.send({employees:employees.tags.map(employee=>employee.fullName), openDate, expiryDate, surveyTemplate});
          scheduleEmailAlerts(newSurvey._id, newSurvey.start_date, newSurvey.expiry_date, employeeMessage)

        } catch (err) {
          console.log(parseError(err))

          res.status(400).send(parseError(err));
        }
      });
    } catch (err) {
      console.log(parseError(err))
      res.status(400).send(parseError(err));
    }
    try {
      scheduleEmailAlerts(newSurvey._id, newSurvey.start_date, newSurvey.expiry_date, employeeMessage);
    } catch (err) {
      console.log(err);
    }
  });
});


export default surveyRoutes;
