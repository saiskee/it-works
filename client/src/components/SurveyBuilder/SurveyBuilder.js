import React, {Component} from 'react'
import './SurveyBuilder.css';
import Question_Icon_SA from './SA.png';
import Question_Icon_MC from './MC.png';
import Question_Icon_Rating from './Rating.png';
import Question_Icon_TF from './TF.png';
import Question_Icon_Dropdown from './Dropdown.png';
import Question_Icon_Checkbox from './Checkbox.png';
import delete_icon from './trash.png';
import {Paper, Card, CardContent,  Typography, Box, Button, Switch, Input, TextField} from "@material-ui/core";
import {Add} from "@material-ui/icons"
import PerfectScrollbar from 'react-perfect-scrollbar';



class SurveyBuilder extends Component {
  constructor(props) {
    super(props);
  }

  removeQuestion(index) {
    this.props.removeQuestion(index);
  }

  render() {
    const questionType = {
      "comment": Question_Icon_SA,
      "True/False": Question_Icon_TF,
      "rating": Question_Icon_Rating,
      "radiogroup": Question_Icon_MC,
      "checkbox": Question_Icon_Checkbox,
      "dropdown": Question_Icon_Dropdown
    };
    return (
        <div className='survey-builder'>
          <table className="toolbox-table">
            <tbody className="table-header">
            <tr>
              <td>TOOLBOX</td>
            </tr>
            </tbody>
            <tbody className="questions">
            <tr>
              <td>
                {Object.keys(questionType).map((key) =>
                    <Paper className="question-type" key={key} onClick={() => this.props.addQuestion(key)}>
                      <img className="Icon-SA" alt="logo" src={questionType[key]}/>
                      {key}
                    </Paper>
                )}
              </td>
            </tr>
            </tbody>
          </table>

          <div className='questions-display'>
            {(this.props.questions.length !== 0) ?
                <table className="survey-builder-view">
                  <tbody className="builder-questions-view">
                  {this.props.questions.map((type, index) =>
                      <tr className="survey-question" key={index}>
                        <td className="title-row">
                          <Typography className="question-number"> {index + 1} . </Typography>

                          <div className="question-title-view">
                            <form>
                              <Input
                                  style={{marginTop: '0px'}}
                                  className="question-title-input"
                                  placeholder='Enter your question here'
                                  value={this.props.questions[index].title}
                                  className='question-name'
                                  name='question-name'
                                  onChange={(event) => this.props.changeQuestionTitle(index, event)}
                              />
                            </form>
                          </div>
                          <div className="toggle-button-label">
                            Required:
                          </div>
                          <div className="toggle-button">
                            <Switch
                                checked={this.props.questions[index].isRequired}
                                onChange={(event) => {
                                  this.props.handleIsRequiredChange(index, event.target.checked);
                                }}
                            />
                          </div>
                          <button className="delete-button" key={index} onClick={() => this.removeQuestion(index)}>
                            <img className="delete-logo" alt="delete_icon" src={delete_icon}/>
                          </button>
                        </td>
                        {type.question}
                      </tr>
                  )}
                  </tbody>
                </table>
                :
                <p className="empty-count">
                  Please add some questions using the button
                </p>
            }
          </div>
          <Paper className='question-bank-table'>
            {this.props.question_bank.map((question, question_bank_index) =>

                <Card className='question-bank-card' key={question._id}>
                  <Button children={<Add/>} onClick={this.props.addQuestionFromQuestionBank.bind(this, question, question_bank_index)}className='question-bank-card-add'/>
                  <CardContent>
                  <Typography
                      variant={'h5'} color={'primary'}> {question.question_data.title ? question.question_data.title : question.name}</Typography>
                    <Typography component={'div'}><Box fontStyle='italic'>{question.question_data.type}</Box></Typography>
                    <Typography>{JSON.stringify(question.question_data.choices)}</Typography>
                  </CardContent>
                </Card>
            )}
          </Paper>
        </div>
    )
  }
}

export default SurveyBuilder;