import Question from '../../models/QuestionSchema';
import mongoose from 'mongoose';
import 'babel-polyfill';

const parseNewTemplateIntoQuestions = async (surveyTemplate, userId) => {
  let {title, description, pages} = surveyTemplate;
  const new_pages = await Promise.all(pages.map(async (page) => {
        const {elements} = page;
        if (elements != undefined) {
          page.elements = await Promise.all(elements.map(async (element) => {
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

const parseExistingTemplateIntoQuestionsIncludeResponses = async (survey) => {
  let pages = survey.survey_template.pages;
  const new_pages = await Promise.all(pages.map(async (page) => {
    const {elements} = page;
    page.elements = await Promise.all(elements.map(async (element) => {
      const savedQuestion = await Question.findOne({_id: element});
      const toReturn = {question_id: element, ...savedQuestion.question_data, survey_responses: savedQuestion.survey_responses}
      return toReturn;
    }))
    return page;
  }));

  survey.survey_template.pages = new_pages;
  return survey;
}


export {parseNewTemplateIntoQuestions, parseExistingTemplateIntoQuestions, parseExistingTemplateIntoQuestionsIncludeResponses}
