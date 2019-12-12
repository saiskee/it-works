import React, { Component } from 'react'
import {Checkbox, Rating, MultipleChoice, TrueFalse, ShortAnswer, Dropdown} from "./QuestionTypes";
import "./Question.css";

class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            type: this.props.type,
            isRequired: false,
        }
       this.changeData = this.changeData.bind(this);
       this.addOption = this.addOption.bind(this);
       this.removeOption = this.removeOption.bind(this);
    }

    changeData(event, index) {
        if(this.state.type !== this.props.type) {
            this.setState({
                data: this.props.data,
                type: this.props.type,
                isRequired: this.props.type
            })
        }
        const newVal = event.target.value;
        this.setState(prevState => {
            const newData = prevState.data.map((val, i) => {
                if(i === index) {
                    return newVal;
                } else {
                    return val;
                }
            });
            this.props.updateData(this.props.index, newData);
            return {
                data: newData
            }
        });
    }

    addOption() {
        if(this.state.type !== this.props.type) {
            this.setState({
                data: this.props.data,
                type: this.props.type,
                isRequired: this.props.type
            })
        }
        this.setState(prevState => {
            if(prevState.type === "rating") {
                const newMax = prevState.data + 1;
                this.props.updateData(this.props.index, newMax);
                return {
                    data: newMax,
                    type: prevState.type,
                    isRequired: prevState.isRequired,
                }
            }
            else {
            const newEntry =  ("Choice " + (prevState.data.length + 1));
            const newData =  [...prevState.data, newEntry];
            this.props.updateData(this.props.index, newData);
            return {
                data: newData,
                type: prevState.type,
                isRequired: prevState.isRequired
            }
            }
        });
    }

    removeOption(index) {
        if(this.state.type !== this.props.type) {
            this.setState({
                data: this.props.data,
                type: this.props.type,
                isRequired: this.props.type
            })
        }
        this.setState(prevState => {
            if(prevState.type === "rating") {
                const newMax = prevState.data - 1;
                this.props.updateData(this.props.index, newMax);
                return {
                    data: newMax,
                    type: prevState.type,
                    isRequired: prevState.isRequired,
                }
            }
            else {
                const newData = prevState.data;
                newData.splice(index, 1);
                this.props.updateData(this.props.index, newData);
                return {
                    data: newData,
                    type: prevState.type,
                    isRequired: prevState.isRequired
                }
            }
        });
    }

    questionPicker() {
        switch(this.props.type) {
            case "comment":
                return <ShortAnswer data={this.props.data} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "radiogroup":
                return <MultipleChoice data={this.props.data} changeData={this.changeData} addOption={this.addOption} removeOption={this.removeOption} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "rating":
                return <Rating data={this.props.data} addOption={this.addOption} removeOption={this.removeOption} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "True/False":
                return <TrueFalse data={this.props.data} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "dropdown":
                return <Dropdown data={this.props.data} changeData={this.changeData} addOption={this.addOption} removeOption={this.removeOption}/>; //TODO: Finish

            case "checkbox":
                return <Checkbox data={this.props.data} changeData={this.changeData} addOption={this.addOption} removeOption={this.removeOption} />;

            default:
                alert("Error Bad Argument");
                return null;
        }
    }

    render() {
        return(
                <td className="question-view">
                    {this.questionPicker()}
                </td>
        )
    }
}



export default Question
