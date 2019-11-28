import React, {Component} from 'react'
import './SurveyBuilder.css';
import Question_Icon_SA from './SA.png';
import Question_Icon_MC from './MC.png';
import Question_Icon_Rating from './Rating.png';
import Question_Icon_TF from './TF.png';
import Question_Icon_Dropdown from './Dropdown.png';
import Question_Icon_Checkbox from './Checkbox.png';
import delete_icon from './trash.png';
import {getQuestions} from '../../actions/questions'
import {connect} from "react-redux";


const mapStateToProps = ({questions}) => ({
  question_bank: questions
});

const mapDispatchToProps = (dispatch) => ({
  getQuestions: () => dispatch(getQuestions())
});

class SurveyBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: this.props.questions
    }
  }

  componentDidMount() {
    this.props.getQuestions();
  }

  addQuestionFromQuestionBank(question_data){
    console.log(question_data);
    this.props.addQuestionFromQuestionBank(question_data);
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
                    <button className="question-type" key={key} onClick={() => this.props.addQuestion(key)}>
                      <img className="Icon-SA" alt="logo" src={questionType[key]}/>
                      {key}
                    </button>
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
                        <p className="question-number"> {index + 1} . </p>

                        <div className="question-title-view">
                          <form>
                            <input
                                type="text"
                                value={this.props.questions[index].title}
                                name="question-name"
                                className="question-name"
                                onChange={(event) => this.props.changeQuestionTitle(index, event)}
                            />
                          </form>
                        </div>

                        <button className="delete-button" key={index} onClick={() => this.props.removeQuestion(index)}>
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
          <table className='question-bank-table'>
            <tbody className='table-header'>
            <tr>
              <td>QUESTION BANK</td>
            </tr>
            </tbody>
            <tbody>
            {/* This table is meant to be used for question bank*/}
            {this.props.question_bank.map((question, question_index) =>
                <tr key={question._id} onClick={this.addQuestionFromQuestionBank.bind(this, question.question_data)}>
                  <td>
                    <button
                        className='question-type'>{/*question.question_data.title ? question.question_data.title : */question.name}</button>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyBuilder);