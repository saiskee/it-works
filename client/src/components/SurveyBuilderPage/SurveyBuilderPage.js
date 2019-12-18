import React, {Component} from 'react';
import './SurveyBuilderPage.css';
import {SurveyBuilder as Builder, Question, EmployeeSelector} from "../";
import {Button, TextField, Modal, Paper, Typography, Card} from '@material-ui/core';
import {CheckCircleOutlined} from "@material-ui/icons";
import $ from "jquery";
import {connect} from 'react-redux';
import {getQuestions} from "../../actions/questions";
import moment from 'moment';
import Grid from "@material-ui/core/Grid";

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
      submitModalOpen: false,
      questions: [],
      employees: {tags: [], suggestions: []},
      title: "",
      surveyOpenDate: parseInt(moment().format('x')),
      surveyCloseDate: parseInt(moment().add('1', 'days').format('x')),
      employeeMessage : '',
      surveyCreationSuccess: false
    };
    this.addQuestion = this.addQuestion.bind(this);
    this.initDataForType = this.initDataForType.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
    this.changeQuestionTitle = this.changeQuestionTitle.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.updateData = this.updateData.bind(this);
    this.generateSurveyJSON = this.generateSurveyJSON.bind(this);
    this.createSurvey = this.createSurvey.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleEmployeeMessage = this.handleEmployeeMessage.bind(this);
  }

  componentDidMount() {
    this.props.getQuestions();
  }

  initDataForType(type) {
    switch (type) {
      case "comment":
        return "Enter your response here";

      case "rating":
        return 11;

      case "True/False":
        return true;

      case "radiogroup":
        return ["Choice 1", "Choice 2", "Choice 3", "Choice 4"];

      case "checkbox":
        return ["Choice 1", "Choice 2", "Choice 3", "Choice 4"];

      case "dropdown":
        return ["Choice ", "Choice 2", "Choice 3", "Choice 4", "Choice 5"];

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
                              updateData={this.updateData} inputDisabled={false}/>,
          type: type
        }]
      };
    });
  }

  addQuestionFromQuestionBank(question, questionBankIndex) {
    console.log(question);
    const {question_data} = question;
    this.setState((prevState) => {
      return {
        questions: [...prevState.questions, {
          data: question_data.choices,
          title: question_data.title,
          question: <Question type={question_data.type}
                              data={question_data.choices ? question_data.choices :question_data.rateMax}
                              index={prevState.questions.length}
                              updateData={this.updateData}
                              inputDisabled={true}
                              />,
          type: question_data.type,
          questionBankQuestion: true,
          _id: question._id,
          questionBankIndex
        }]
      }
    });
    this.props.question_bank.splice(questionBankIndex, 1);
  }

  removeQuestion(index) {
    this.setState((prevState) => {
      const newQuestions = prevState.questions;
      const question_being_removed = newQuestions[index];
      console.log(question_being_removed);
      // If question being removed is from question bank, put it back into the question bank
      if (question_being_removed.questionBankQuestion) {
        const original_question_bank_index = this.props.question_bank_store.findIndex((question) => question._id === question_being_removed._id);
        this.props.question_bank.splice(0, 0, this.props.question_bank_store[original_question_bank_index])
      }
      // Remove question from current list of questions
      newQuestions.splice(index, 1);
      // Modify all questions following question being removed
      for (let i = index; i < prevState.questions.length; i++) {
        if (newQuestions[i].question.props.type !== null) {
          newQuestions[i].question =
              <Question type={newQuestions[i].question.props.type} data={newQuestions[i].data} index={i}
                        updateData={this.updateData} inputDisabled={newQuestions[i].questionBankQuestion}/>
        }
      }
      return {questions: newQuestions};
    });
  }

  changeQuestionTitle(index, event) {
    const newTitle = event.target.value;
    this.setState((prevState) => {
      const newQ = prevState.questions;
      newQ[index].title = newTitle;
      return {questions: newQ};
    });
  }

  changeTitle(event) {
    const newTitle = event.target.value;
    this.setState(() => {
      return {title: newTitle}
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

  handleSurveyOpenDate(event) {
    let closeDate = this.state.surveyCloseDate;
    let openDate = parseInt(moment(event.target.value).format('x'));
    if (closeDate < openDate) {
      this.setState({expiryDateInvalid: true})
    } else {
      this.setState({expiryDateInvalid: false})
    }
    if (openDate < Date.now()) {
      this.setState({openDateInvalid: true})
    } else {
      this.setState({openDateInvalid: false})
    }
    this.setState({surveyOpenDate: parseInt(moment(event.target.value).format('x'))});
  }

  handleSurveyCloseDate(event) {
    let closeDate = parseInt(moment(event.target.value).format('x'));
    let openDate = this.state.surveyOpenDate;
    if (closeDate < openDate) {
      this.setState({expiryDateInvalid: true})
    } else {
      this.setState({expiryDateInvalid: false})
    }
    this.setState({surveyCloseDate: parseInt(moment(event.target.value).format('x'))})
  }

  handleEmployeeMessage(event){
    this.setState({
      employeeMessage: event.target.value
    })
  }

  updateData(index, data) {
    const newData = data;
    this.setState((prevState) => {
      const newQ = prevState.questions;
      newQ[index].data = newData;
      newQ[index].question =
          <Question type={prevState.questions[index].question.props.type} data={newData} index={index}
                    updateData={this.updateData} inputDisabled={prevState.questions[index].questionBankQuestion}/>;
      return {questions: newQ};
    });
  }

  handleEmployeeChange = (employees) => {
    this.setState({employees})
  }

  generateSurveyJSON() {
    // TODO: Once we can edit survey title we should change this.
    let survey = {
      title: this.state.title,
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
    if (this.state.expiryDateInvalid) {
      alert('Survey close date can not be before open date');
      return;
    }
    if (this.state.openDateInvalid) {
      alert('Survey open date can not be before survey creation');
      return;
    }
    if (this.state.title.length < 1) {
      alert('Please assign the survey a title before creation');
      return;
    }

    const toServer = {
      employees,
      surveyTemplate: surveyJSON,
      openDate: this.state.surveyOpenDate,
      expiryDate: this.state.surveyCloseDate,
      employeeMessage: this.state.employeeMessage
    }
    const response = $.ajax('/api/survey', {
      method: 'POST',
      data: JSON.stringify(toServer),
      contentType: 'application/json',
      success: (data, status, xhttp) => {
        if (status === 'success'){
          this.setState({surveyCreationSuccess: true})
        }
      }
    })
    if (response.statusText === 'OK'){

    }
  }

  handleModalClose() {
    if (!this.state.surveyCreationSuccess) {
      this.setState({submitModalOpen: false});
    }
  }

  handleModalOpen() {
    this.setState({submitModalOpen: true});
  }

  renderModal() {
    const classes = {
      paper: {
        flexDirection: 'column',
        dropShadow: '0 3px 7px rgba(0, 0, 0, 0.3)',
        position: 'absolute',
        top: '20vh',
        left: '20vw',
        width: '60vw',
        padding: '2%',
      },
      gridDiv: {
        marginTop: '2%'
      },
      sendButton: {
        marginTop: '4%',
        right: '-85%',
      }
    }
    return (
        <Modal open={this.state.submitModalOpen} onClose={this.handleModalClose}>
          <Paper style={classes.paper}>
            {this.state.surveyCreationSuccess ? <>
              <Grid container direction={'column'} spacing={2} alignItems={'center'}>
                <Grid item s={12} md={12} lg={12}>
                  <CheckCircleOutlined style={{fontSize: '10em'}} color={'primary'}/>
                </Grid>
                <Grid item s={12} md={12} lg={12}>
                  <Typography variant={'h2'}>Your survey has been successfully created</Typography>
                </Grid>
                <Grid item s={12} md={12} lg={12} style={{marginTop: '20px'}}>
                  <Button color={'primary'} variant={'outlined'} onClick={() => this.props.history.push('/managerdashboard')}>Back to Dashboard</Button>
                </Grid>
              </Grid>

            </> : <>
              <Typography variant={'h3'} color={'primary'}>Send to Employees</Typography>
              <Grid container style={classes.gridDiv} direction={'row'} spacing={2}>
                <Grid item lg={4} md={4} sm={4}>
                  {/*<EmployeeSelector handleEmployeeChange={this.handleEmployeeChange.bind(this)}/>*/}
                  <Card style={{margin: '0 3%', padding: '5%'}}>
                    <TextField
                        fullWidth
                        onChange={this.handleSurveyOpenDate.bind(this)}
                        defaultValue={moment(this.state.surveyOpenDate).format('YYYY-MM-DD[T]HH:mm')}
                        id="datetime-local"
                        label="Survey Open Time"
                        type="datetime-local"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={this.state.openDateInvalid}/>
                    <TextField
                        style={{marginTop: '15px'}}
                        fullWidth
                        defaultValue={moment(this.state.surveyCloseDate).format('YYYY-MM-DD[T]HH:mm')}
                        onChange={this.handleSurveyCloseDate.bind(this)}
                        id="datetime-local"
                        label="Survey Expiry Time"
                        type="datetime-local"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={this.state.expiryDateInvalid}
                    />
                  </Card>
                </Grid>
                <Grid item sm={8} md={8} lg={8}>
                  <EmployeeSelector handleEmployeeChange={this.handleEmployeeChange.bind(this)}/>
                  <TextField id="standard-multiline-static"
                             multiline
                             rows="10"
                             style={{paddingTop: '5px', width: '100%'}}
                             variant={'outlined'}
                             placeholder="Enter a message to send with the survey to the assigned employees..."
                             value={this.state.employeeMessage}
                             onChange={this.handleEmployeeMessage}
                  />
                </Grid>
              </Grid>
              <Button color={'primary'} style={classes.sendButton} onClick={this.createSurvey}>Send Survey</Button>
            </>}

          </Paper>
        </Modal>
    );
  }

  render() {
    return (
        <>
          {/*<EmployeeSelector handleEmployeeChange={this.handleEmployeeChange.bind(this)} style={{zIndex: -100}}/>*/}
          <div className="header">
            <TextField color={'primary'} placeholder='Enter Survey Title here' value={this.state.title}
                       className="title"
                       onChange={(event) => this.changeTitle(event)}/>
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
              expiryDateInvalid={this.state.expiryDateInvalid}
              openDateInvalid={this.state.openDateInvalid}
          />
          {this.renderModal()}
          <Button variant={'contained'} onClick={this.generateSurveyJSON}
                  title='View Console Log to See Survey JSON (debugging purposes)'>Generate JSON</Button>
          <Button variant={'contained'} color={'primary'} onClick={this.handleModalOpen} title={'Create Survey'}>
            Create Survey
          </Button>

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
    rateMax: question.data,
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
    return {type: 'questionbankquestion', _id: question._id, name: questionName}
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
