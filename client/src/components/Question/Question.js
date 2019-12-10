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
       this.addOption = this.addOption.bind(this);
       this.removeOption = this.removeOption.bind(this);
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

    addOption() {
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
            <button onClick={() => props.removeOption(index)}>X</button>
        </label>
        )}
        <div>
            <button onClick={() => props.addOption()}>+</button>
        </div>
        </div>
    )
}

function Rating(props) {
    const data = [];
    for(let i = 1; i < props.data; i++) {
        data[i] = i;
    }
    return (
            <div className="rating-question-container">
                <div className="rating-grid">
                {data.map((value, index) =>
                    <div key={index}>
                        <label className="rating-question" key={index}>
                            { value }
                            <button onClick={() => props.removeOption(index)}>X</button>
                        </label>
                    </div>
                    )}
                </div>
                <div>
                    <button onClick={() => props.addOption()}>+</button>
                </div>
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
                <button onClick={() => props.removeOption(index)}>X</button>
                </div>
                )}
                <div>
                    <button onClick={() => props.addOption()}>+</button>
                </div>
    </div>
    )
}

function Checkbox(props) {
    return (
        <div className="mc-grid">
            {props.data.map((value, index) =>
                <div className="checkbox-div" key={index}>
                    <label>
                        <input className="checkbox-input" disabled type="checkbox" value={value} key={index} />
                    </label>

                    <input
                        type="text"
                        key={index}
                        value={value}
                        className="checkbox-question"
                        onChange={(event) => props.changeData(event, index)}
                    />
                <button onClick={() => props.removeOption(index)}>X</button>
                </div>
        )}
        <div>
            <button onClick={() => props.addOption()}>+</button>
        </div>
        </div>
    )
}

export default Question
