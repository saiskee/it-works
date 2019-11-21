import express from 'express';
import Question from '../models/QuestionSchema';
import User from '../models/UserSchema';
import mongoose from 'mongoose';
import {parseError} from "../../util/helper";

const questionRoutes = express.Router();

function summarizeMultiChoice(question) {
    let sumAnswer = (current_summary, answer) => {
        if (answer in current_summary) {
            current_summary[answer] += 1
        } else {
            current_summary[answer] = 1
        }
        return current_summary; 
    };
    return question.survey_responses.reduce((answer_sum, response) => {
        // This is a double reduce. 
        // Collapse all the responses into one summary objects and sum over there
        // answer array.
       return response.answer.reduce(sumAnswer, answer_sum);
    }, {});
}

function summarizedFreeResponse(question){
    let sumAnswer = (current_summary, answer) => {
        if (answer in current_summary) {
            current_summary[answer] += 1
        } else {
            current_summary[answer] = 1
        }
        return current_summary;
    };
    return question.surver_response.reduce(sumAnswer, {});
}

function summarizeRating(question) {
    let current_summary = {};
    var i;
    for (i = 1; i <= question.question_data.rateMax; i++) {
    current_summary[i.toString(10)]=0
    }
    var p;
    for (p=0; p<question.survey_responses.length; p++){
        current_summary[question.survey_responses[p][answer]]+=1;
    }
    return current_summary;
}

/* GET /:questionId
 * Will return the summarized info for this question.
 * Refer to the summary function for the question type for return value.
 * User must OWN question to get a valid response back.
 */
questionRoutes.get('/:questionId', (req, res) => {
    const {userId} = req.session.user;
    const {questionId} = req.params;
    // Make sure this user exists and owns the question.
    Question.findOne({ _id: mongoose.Types.ObjectId(questionId)}, (err, question) => {
        try {
            if (err) throw new Error(err);
            if (question === undefined || question === null) throw new Error("Question does not exist");
            if (!question.author.equals(mongoose.Types.ObjectId(userId))) {
                res.status(401).send("Not authorized to view this question");
            }
            switch (question.question_data.type) {
                case 'checkbox':
                    res.send(summarizeMultiChoice(question));
                    return;
                case 'rating':
                    res.send(summarizeRating(question));
                // TODO: Insert your question type here.
            }
        } catch(err) {
           res.status(400).send(parseError(err));
       }
    });
});

export default questionRoutes;
