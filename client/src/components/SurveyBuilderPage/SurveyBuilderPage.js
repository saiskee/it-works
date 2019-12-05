import React, {Component} from 'react';
import logo from '../SurveyBuilder/logo.png';
import './SurveyBuilderPage.css';
import Builder from '../SurveyBuilder';
import Question from '../Question';
import EmployeeSelector from "../EmployeeSelector/EmployeeSelector";
import {Button, makeStyles} from '@material-ui/core';
import $ from "jquery";
import {connect} from 'react-redux';
import {getQuestions} from "../../actions/questions";
import moment from 'moment';

const mapStateToProps = ({questions}) => ({
  question_bank: questions,
  question_bank_store: questions.slice()
});

const mapDispatchToProps = (dispatch) => ({
  getQuestions: () => dispatch(getQuestions())
});


class SurveyBuilderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      employees: {tags: [], suggestions: []},
      surveyOpenDate: parseInt(moment().format('x')),
      surveyCloseDate: parseInt(moment().add('1', 'days').format('x'))
    };
    this.addQuestion = this.addQuestion.bind(this);
    this.initDataForType = this.initDataForType.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.changeQuestionTitle = this.changeQuestionTitle.bind(this);
    this.updateData = this.updateData.bind(this);
    this.generateSurveyJSON = this.generateSurveyJSON.bind(this);
    this.createSurvey = this.createSurvey.bind(this);
  }

  componentDidMount() {
    console.log("Survey Builder Page Mounted");
    this.props.getQuestions();
  }

  initDataForType(type) {
    switch (type) {
      case "comment":
        return "Enter your response here";

      case "rating":
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

      case "True/False":
        return true;

      case "radiogroup":
        return ["Choice 1", "Choice 2", "Choice 3", "Choice 4"];

      case "checkbox":
        return ["Choice 1", "Choice 2", "Choice 3", "Choice 4"];

      case "dropdown":
        return ["Item1", "Item2", "Item3", "Item4", "Item5"];

      default:
        return [];
    }
    ;
  }

  addQuestion(type) {
    const initData = this.initDataForType(type);
    this.setState((prevState) => {
      return {
        questions: [...prevState.questions, {
          data: initData,
          title: "",
          question: <Question type={type} data={initData} index={prevState.questions.length}
                              updateData={this.updateData}/>,
          type: type
        }]
      };
    });
  }

  addQuestionFromQuestionBank(question, questionBankIndex) {
    const {question_data} = question;
    this.setState((prevState) => {
      return {
        questions: [...prevState.questions, {
          data: question_data.choices,
          title: question_data.title,
          // TODO: Fix how rating (rateMax) is rendered, currently using a hacky solution
          question: <Question type={question_data.type}
                              data={question_data.choices ? question_data.choices : Array.from(Array(question_data.rateMax).keys())}
                              index={prevState.questions.length}
                              updateData={this.updateData}/>,
          type: question_data.type,
          questionBankQuestion: true,
          _id: question._id,
          questionBankIndex
        }]
      }
    });
    // console.log("QUESTIONBANK:", this.props.question_bank[questionBankIndex]);
    this.props.question_bank.splice(questionBankIndex, 1);
  }

  // TODO: Fix Remove question to keep questionbank data
  removeQuestion(index) {
    this.setState((prevState) => {
      const newQuestions = prevState.questions;
      const question_being_removed = newQuestions[index];
      // If question being removed is from question bank, put it back into the question bank
      if (question_being_removed.questionBankQuestion) {
        const {questionBankIndex} = question_being_removed;
        this.props.question_bank.splice(questionBankIndex, 0, this.props.question_bank_store[questionBankIndex])
      }
      // Remove question from current list of questions
      newQuestions.splice(index, 1);
      // Modify all questions following question being removed
      for (let i = index; i < prevState.questions.length; i++) {
        const newQ = (newQuestions[i].question.props.type !== null) ?
            <Question type={newQuestions[i].question.props.type} data={newQuestions[i].data} index={i}
                      updateData={this.updateData}/> : null;
        newQuestions[i] = (newQ !== null) ? {
          data: newQuestions[i].data,
          title: newQuestions[i].title,
          question: newQ,
          ...newQuestions[i]
        } : prevState.questions[i + 1];
      }
      return {questions: newQuestions};
    });
  }

  changeQuestionTitle(index, event) {
    var newTitle = event.target.value;
    this.setState((prevState) => {
      const newQ = prevState.questions;
      newQ[index].title = newTitle;
      return {questions: newQ};
    });
  }

  handleIsRequiredChange(index, value) {
    let newIsRequired = value;
    this.setState((prevState) => {
      const newQ = prevState.questions;
      newQ[index].isRequired = newIsRequired;
      return {questions: newQ};
    });
  }

  handleSurveyOpenDate(event){
    let closeDate = this.state.surveyCloseDate;
    let openDate = parseInt(moment(event.target.value).format('x'));
    if (closeDate < openDate){
      this.setState({expiryDateInvalid: true})
    }else{
      this.setState({expiryDateInvalid: false})
    }
    if (openDate < Date.now()){
      this.setState({openDateInvalid: true})
    }else{
      this.setState({openDateInvalid: false})
    }
    this.setState({surveyOpenDate: parseInt(moment(event.target.value).format('x'))});
  }

  handleSurveyCloseDate(event){
    let closeDate = parseInt(moment(event.target.value).format('x'));
    let openDate = this.state.surveyOpenDate;
    if (closeDate < openDate){
      this.setState({expiryDateInvalid: true})
    }else{
      this.setState({expiryDateInvalid: false})
    }
    this.setState({surveyCloseDate: parseInt(moment(event.target.value).format('x'))})
  }


  updateData(index, data) {
    var newData = data;
    this.setState((prevState) => {
      const newQ = prevState.questions;
      newQ[index].data = newData;
      newQ[index].question =
          <Question type={prevState.questions[index].question.props.type} data={newData} index={index}
                    updateData={this.updateData}/>;
      return {questions: newQ};
    });
  }

  handleEmployeeChange = (employees) => {
    this.setState({employees})
  }

  generateSurveyJSON() {
    // TODO: Once we can edit survey title we should change this.
    let survey = {
      title: "Generic Survey Title",
      pages: []
    };
    let questionIndex = 0;
    let surveyJSQuestions = this.state.questions.map(question => toSurveyJS('question' + questionIndex++, question));
    survey.pages = surveyJSQuestions.reduce(toPagesOfSize(10), survey.pages);
    console.log(survey);
    return survey;

  }

  /**
   * Generate Survey JSON and send to server to be saved, and assigned to all employees
   */
  createSurvey() {
    const surveyJSON = this.generateSurveyJSON();
    const {employees} = this.state;
    if (employees.tags.length < 1) {
      alert('Please select at least one employee to assign the survey to before submitting.');
      return;
    }
    if (this.state.expiryDateInvalid){
      alert('Survey close date can not be before open date');
      return;
    }
    if (this.state.openDateInvalid){
      alert('Survey open date can not be before survey creation');
    }

    const toServer = {
      employees,
      surveyTemplate: surveyJSON,
      openDate: this.state.surveyOpenDate,
      expiryDate: this.state.surveyCloseDate
    }
    $.ajax('/api/survey', {
      method: 'POST',
      data: JSON.stringify(toServer),
      contentType: 'application/json'
    })
  }

  render() {
    return (
        <>
          <EmployeeSelector handleEmployeeChange={this.handleEmployeeChange.bind(this)} style={{zIndex: -100}}/>
          <div className="header">
            <p className="title">
              Sample Survey Title
            </p>
          </div>

          <Builder
              questions={this.state.questions}
              question_bank={this.props.question_bank}
              addQuestion={this.addQuestion.bind(this)}
              removeQuestion={this.removeQuestion.bind(this)}
              changeQuestionTitle={this.changeQuestionTitle.bind(this)}
              addQuestionFromQuestionBank={this.addQuestionFromQuestionBank.bind(this)}
              handleIsRequiredChange={this.handleIsRequiredChange.bind(this)}
              surveyOpenDate={this.state.surveyOpenDate}
              handleSurveyOpenDate={this.handleSurveyOpenDate.bind(this)}
              surveyCloseDate={this.state.surveyCloseDate}
              handleSurveyCloseDate={this.handleSurveyCloseDate.bind(this)}
              expiryDateInvalid = {this.state.expiryDateInvalid}
              openDateInvalid = {this.state.openDateInvalid}
          />

          <Button variant={'contained'} onClick={this.generateSurveyJSON}
                  title='View Console Log to See Survey JSON (debugging purposes)'>Generate JSON</Button>
          <Button variant={'contained'} color={'primary'} onClick={this.createSurvey} title={'Create Survey'}>Create
            Survey</Button>

        </>
    );
  }
}

function toPagesOfSize(pageSize) {
  let pageIndex = 0;
  return (pagesObject, question) => {
    // If there is a valid pages object and it has less than the specified
    // page size worth of questions.
    if (pagesObject.length > 0 &&
        pagesObject[pagesObject.length - 1]['elements'] !== undefined &&
        pagesObject[pagesObject.length - 1].elements.length < pageSize) {
      // Add to the last page in the object.
      pagesObject[pagesObject.length - 1].elements.push(question);
    } else {
      // Create a new page object, append.
      pagesObject.push({
        name: 'page' + pageIndex++,
        elements: [question]
      });
    }
    return pagesObject;
  }
}

function ShortAnswerToJS(questionName, question) {
  return {
    type: "comment",
    name: questionName,
    title: question.title,
    isRequired: question.isRequired
  };
}

function TrueFalseToJS(questionName, question) {
  return {
    type: "radiogroup",
    name: questionName,
    title: question.title,
    choices: [
      "True",
      "False"
    ],
    isRequired: question.isRequired
  };
}

function RatingToJS(questionName, question) {
  return {
    type: "rating",
    name: questionName,
    title: question.title,
    rateMax: question.data.reduce((x, y) => Math.max(x, y), 0),
    isRequired: question.isRequired
  };
}

function MultipleChoiceToJS(questionName, question) {
  return {
    type: "radiogroup",
    name: questionName,
    title: question.title,
    choices: question.data,
    isRequired: question.isRequired
  };
}

function CheckboxToJS(questionName, question) {
  return {
    type: "checkbox",
    name: questionName,
    title: question.title,
    choices: question.data,
    isRequired: question.isRequired
  }
}

function DropdownToJS(questionName, question) {
  return {
    type: "dropdown",
    name: questionName,
    title: question.title,
    choices: question.data,
    isRequired: question.isRequired
  };
}

function toSurveyJS(questionName, question) {
  // Turns a question into a survey js object.

  // if question is from the question bank
  if (question.questionBankQuestion) {
    return {type: 'questionbankquestion', _id: question._id}
  }
  // console.log(question);
  switch (question.type) {
    case "comment":
      return ShortAnswerToJS(questionName, question);
    case "True/False":
      return TrueFalseToJS(questionName, question);
    case "rating":
      return RatingToJS(questionName, question);
    case "radiogroup":
      return MultipleChoiceToJS(questionName, question);
    case "checkbox":
      return CheckboxToJS(questionName, question);
    case "dropdown":
      return DropdownToJS(questionName, question);
    default:
      alert("Wrong type for conversion to survey js." + question.type);
      return {};
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBuilderPage);
