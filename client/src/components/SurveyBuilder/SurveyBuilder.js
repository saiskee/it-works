import React, {Component} from 'react'
import './SurveyBuilder.css';
import logo from './it-works-logo.png';
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Switch,
  Input,
  TextField,
  CardHeader
} from "@material-ui/core";
import {
  Add,
  Delete,
  ChatBubbleOutlined,
  ThumbsUpDownOutlined,
  StarHalfOutlined,
  RadioButtonCheckedOutlined,
  CheckBoxOutlined,
  ArrowDropDownCircle, Image
} from "@material-ui/icons"
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

class SurveyBuilder extends Component {
  constructor(props) {
    super(props);
    this.defaultSurveyOpenDate = moment(this.props.surveyOpenDate).format('YYYY-MM-DD[T]HH:mm');
    this.defaultSurveyCloseDate = moment(this.props.surveyCloseDate).format('YYYY-MM-DD[T]HH:mm');
  }

  removeQuestion(index) {
    this.props.removeQuestion(index);
  }

  render() {
    const questionType = {
      "comment": <ChatBubbleOutlined/>,
      "True/False": <ThumbsUpDownOutlined/>,
      "rating": <StarHalfOutlined/>,
      "radiogroup": <RadioButtonCheckedOutlined/>,
      "checkbox": <CheckBoxOutlined/>,
      "dropdown": <ArrowDropDownCircle/>
    };

    return (
        <div className='survey-builder'>
          <Paper className={'toolbox-table'}>
            <Typography style={{margin: '5% 0'}} variant={'h3'}>Question Types</Typography>
            <Grid container spacing={1} justify={'space-between'} style={{padding: '0 5%'}}>

              {Object.keys(questionType).map((key, index) =>
                  <Grid item sm={3} md={3} lg={6} key={index}>
                    <Card className="question-type" onClick={() => this.props.addQuestion(key)}>
                      {questionType[key]}
                      <Typography>{key}</Typography>
                    </Card>
                  </Grid>
              )}

            </Grid>
            <img src={logo} style={{margin: '25% 9%'}}/>
          </Paper>
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
                              <TextField
                                  style={{marginTop: '0px'}}
                                  placeholder='Enter your question here'
                                  value={this.props.questions[index].title}
                                  className='question-name'
                                  name='question-name'
                                  onChange={(event) => this.props.changeQuestionTitle(index, event)}
                                  color={'primary'}
                                  disabled={this.props.questions[index].questionBankQuestion}
                              />
                            </form>
                          </div>
                          <div className="toggle-button-label">
                            Required:
                          </div>
                          <div>
                            <Switch
                                checked={!!this.props.questions[index].isRequired}
                                onChange={(event) => {
                                  this.props.handleIsRequiredChange(index, event.target.checked);
                                }}
                                color={'primary'}
                            />
                          </div>
                          <IconButton color='primary' className="delete-button" key={index}
                                      onClick={() => this.removeQuestion(index)}>
                            <Delete className={'delete-logo'}/>
                          </IconButton>
                        </td>
                        {type.question}
                      </tr>
                  )}
                  </tbody>
                </table>
                :
                <p className="empty-count">
                  Please add some questions using the buttons to the left
                </p>
            }
          </div>
          <Paper className='question-bank-table'>
            {this.props.question_bank.map((question, question_bank_index) =>

                <Card className='question-bank-card' key={question._id}>
                  <Button children={<Add/>}
                          onClick={this.props.addQuestionFromQuestionBank.bind(this, question, question_bank_index)}
                          className='question-bank-card-add'/>
                  <CardContent>
                    <Typography
                        variant={'h5'}
                        color={'primary'}> {question.question_data.title ? question.question_data.title : question.name}</Typography>
                    <Typography component={'div'}><Box
                        fontStyle='italic'>{question.question_data.type}</Box></Typography>
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