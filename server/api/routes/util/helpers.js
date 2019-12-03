import Question from '../../models/QuestionSchema';
import mongoose from 'mongoose';
import 'babel-polyfill';

// Create new question entries in the database for each question in a survey template
// Return survey template with question id's instead of question data
const parseNewTemplateIntoQuestions = async (surveyTemplate, userId) => {
  let {pages} = surveyTemplate;
  const new_pages = await Promise.all(pages.map(async (page) => {
        const {elements} = page;
        if (elements != undefined) {
          page.elements = await Promise.all(elements.map(async (element) => {
            if (element.type === 'questionbankquestion'){
              return mongoose.Types.ObjectId(element._id);
            }

            const question = new Question({
              question_data: element,
              name: element.name,
              author: userId
            });

            const savedQuestion = await question.save(); //This gives us back the question that we just saved in the database
            return mongoose.Types.ObjectId(savedQuestion._id);
          }));
        } else {
            page.elements = [];
        }
        return page;
      })
  );
  surveyTemplate.pages = new_pages;
  return surveyTemplate;
}

const parseExistingTemplateIntoQuestions = async (survey) => {
  let pages = survey.survey_template.pages;
  const new_pages = await Promise.all(pages.map(async (page) => {
    const {elements} = page;
    page.elements = await Promise.all(elements.map(async (element) => {
      const savedQuestion = await Question.findOne({_id: element});
      return {question_id: element, ...savedQuestion.question_data};
    }))
  return page;
  }));

  survey.survey_template.pages = new_pages;
  return survey;
}

// Takes a list of survey_responses and groups them into arrays based on the survey which they come from
function groupBy(list, keyGetter) {
  const map = {};
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map[key];
    if (!collection) {
      map[key] = [item];
    } else {
      collection.push(item);
    }
  });
  return map;
}

function summarizeRadioGroup(question){
  let sumAnswer = (current_summary, response) => {
    const {answer} = response;
    if (answer in current_summary) {
      current_summary[answer] += 1
    } else {
      current_summary[answer] = 1
    }
    return current_summary;
  };

  const groupedBySurvey = groupBy(question.survey_responses, answer => answer.survey_id);
  for (const survey in groupedBySurvey) {
    // console.log(JSON.stringify(groupedBySurvey[survey]))
    groupedBySurvey[survey] = groupedBySurvey[survey].reduce(sumAnswer, {});
  }
  return groupedBySurvey;
}

function summarizeMultiChoice(question) {
  let sumAnswer = (current_summary, answer) => {
    if (answer in current_summary) {
      current_summary[answer] += 1
    } else {
      current_summary[answer] = 1
    }
    return current_summary;
  };

  const groupedBySurvey = groupBy(question.survey_responses, answer => answer.survey_id);
  for (const survey in groupedBySurvey){
    groupedBySurvey[survey] = groupedBySurvey[survey].reduce((answer_sum, response) => {
      // This is a double reduce.
      // Collapse all the responses into one summary objects and sum over their
      // answer array.
      return response.answer.reduce(sumAnswer, answer_sum);
    }, {});
  }
  return groupedBySurvey;
}

function summarizedFreeResponse(question){
  let sumAnswer = (current_summary, response) => {
    const answer = response.answer;
    current_summary.push(answer)
    // if (answer in current_summary) {
    //   current_summary[answer] += 1
    // } else {
    //   current_summary[answer] = 1
    // }
    return current_summary;
  };

  const groupedBySurvey = groupBy(question.survey_responses, answer => answer.survey_id);
  for (const survey in groupedBySurvey) {
    groupedBySurvey[survey] = groupedBySurvey[survey].reduce(sumAnswer, []);
  }
  return groupedBySurvey;
}

function summarizeRating(question) {
  const groupedBySurvey = groupBy(question.survey_responses, answer => answer.survey_id);
  for (const survey in groupedBySurvey) {
    let current_summary = {};
    for (let i = 1; i <= question.question_data.rateMax; i++) {
      current_summary[i.toString(10)] = 0
    }
    groupedBySurvey[survey].forEach(response => { current_summary[response.answer] += 1})
    groupedBySurvey[survey] = current_summary;
  }

  return groupedBySurvey;
}

const parseExistingTemplateIntoQuestionsIncludeResponses = async (survey) => {
  let pages = survey.survey_template.pages;
  const new_pages = await Promise.all(pages.map(async (page) => {
    const {elements} = page;
    page.elements = await Promise.all(elements.map(async (element) => {
      const savedQuestion = await Question.findOne({_id: element});
      let analytics;
      switch (savedQuestion.question_data.type) {
        case 'radiogroup':
          analytics = summarizeRadioGroup(savedQuestion);
          break;
        case 'checkbox':
          analytics = summarizeMultiChoice(savedQuestion);
          break;
        case 'rating':
          analytics = summarizeRating(savedQuestion);
          break;
        case 'text':
        case 'comment':
          analytics = summarizedFreeResponse(savedQuestion);
          break;

          // TODO: Insert your question type here.
      }
      const toReturn = {question_id: element, ...savedQuestion.question_data, survey_responses: savedQuestion.survey_responses, analytics: analytics}
      return toReturn;
    }));

    return page;
  }));

  survey.survey_template.pages = new_pages;
  return survey;
}


export {parseNewTemplateIntoQuestions, parseExistingTemplateIntoQuestions, parseExistingTemplateIntoQuestionsIncludeResponses}
