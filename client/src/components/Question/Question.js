import React, { Component } from 'react'
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
    }

    changeData(event, index) {
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

    questionPicker() {
        switch(this.props.type) {
            case "comment":
                return <ShortAnswer data={this.props.data} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "radiogroup":
                return <MultipleChoice data={this.props.data} changeData={this.changeData} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "rating":
                return <Rating data={this.props.data} changeData={this.changeData} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "True/False":
                return <TrueFalse data={this.props.data} toSurveyJSQuestion={this.toSurveyJSQuestion}/>;

            case "dropdown":
                return <Dropdown data={this.props.data} changeData={this.changeData} />; //TODO: Finish

            case "checkbox":
                return <Checkbox data={this.props.data} changeData={this.changeData}/>;

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

function ShortAnswer(props) {
    return (
        <div>
            <textarea
                type="text"
                value={props.data}
                name="saq"
                rows="4"
                cols="50"
                className="sa-question"
                readOnly
            />
        </div>
    )
}

function MultipleChoice(props) {
    return (
        <div className="mc-grid">
        {props.data.map((key, index) =>
            <label className="container" key={index}>
            <input
                type="radio"
                key={"r" + index}
                value={index}
                checked={index === 0}
                className="radio-button"
                readOnly
            />
            <span className="checkmark"></span>
            <input
                type="text"
                key={index}
                value={key}
                className="mc-question"
                onChange={(event) => props.changeData(event, index)}
            />
        </label>
        )}
        </div>
    )
}

function Rating(props) {
    return (
        <div className="rating-grid">
            <label className="container">
                {props.data.map((value, index) =>
                    <input
                        type="text" 
                        key={index}
                        value={value}
                        className="rating-question"
                        onChange={(event) => props.changeData(event, index)}
                    />
                )}
            </label>
        </div>
    )
}

function TrueFalse(props) {
    return (
        <div>
            <label className="container">
                <input
                    type="radio"
                    value="True"
                    checked={props.data === true}
                    className="radio-button"
                    readOnly
                />
                <span className="checkmark"></span>
                True
            </label>
                        
            <label className="container">
                <input
                    type="radio"
                    value="False"
                    checked={props.data === false}
                    className="radio-button"
                    readOnly
                />
                <span className="checkmark"></span>
                False
            </label>
        </div>
    )
}

function Dropdown(props) {
    return (
        <div className="mc-grid">
            <button className="choose-button">
                Choose...
            </button>
            {props.data.map((value, index) =>
                <div className="dropdownbox" key={index}>
                    <input
                        type="text"
                        key={index}
                        value={value}
                        className="dropdown-question"
                        onChange={(event) => props.changeData(event, index)}
                    /> 
                </div>
            )}
    </div>
    )
}

function Checkbox(props) {
    return (
        <div className="mc-grid">
            {props.data.map((value, index) =>
                <div className="checkbox" key={index}>
                    <label>
                        <input className="checkbox-input" type="checkbox" value={value} key={index} />
                    </label>
                    <input
                        type="text"
                        key={index}
                        value={value}
                        className="mc-question"
                        onChange={(event) => props.changeData(event, index)}
                    /> 
                </div>
            )}
        </div>
    )
}

export default Question
