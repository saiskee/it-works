import React from "react";
import {Button, IconButton, Typography, ButtonGroup, Radio, Checkbox as CB} from "@material-ui/core"
import {BackspaceOutlined, AddCircleOutlined} from "@material-ui/icons";
import './Question.css'

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
            <div className="question-container" key={index}>
              <Radio
                  color={'primary'}
                  type="radio"
                  key={"r" + index}
                  value={index}
                  disabled
              />
              <input
                  type="text"
                  key={index}
                  value={key}
                  className="mc-question"
                  onChange={(event) => props.changeData(event, index)}
              />
              <IconButton title={'Delete \'' + key + '\''} color='primary'
                          onClick={() => props.removeOption(index)}><BackspaceOutlined/></IconButton>
            </div>
        )}
        <div>
          <Button color={'primary'} variant='outlined'
                  onClick={() => props.addOption()}>
            <AddCircleOutlined style={{marginRight: '5px'}}/><Typography color={'primary'}>Add Choice</Typography>
          </Button>
        </div>
      </div>
  )
}

function Rating(props) {
  const data = [];
  for (let i = 1; i < props.data; i++) {
    data[i] = i;
  }
  return (
      <div className="rating-question-question-container">
        <div className="rating-grid">
          <ButtonGroup className={'rating-question'}>
            {data.map((value, index) =>
                <Button key={index}>
                  {value}
                </Button>
            )}
          </ButtonGroup>{data.length > 0 && <IconButton title='Remove One Rating Step'
                                                        onClick={() => props.removeOption(0)}><BackspaceOutlined/></IconButton>}
          <IconButton title={'Add One Rating Step'} onClick={props.addOption}
                      color={'primary'}><AddCircleOutlined/></IconButton>
        </div>
      </div>
  )
}

function TrueFalse(props) {
  return (
      <div>
        <div className="question-container">
          <Radio
              value="True"
              className="radio-button"
              disabled
          />
          <input type={'text'} value={'True'} disabled/>
        </div>
        <div className="question-container">
          <Radio
              value="False"
              className="radio-button"
              disabled
          />
          <input type={'text'} value={'False'} disabled />
        </div>
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
              <IconButton color='primary' onClick={() => props.removeOption(index)}><BackspaceOutlined/></IconButton>
            </div>
        )}
        <div>
          <Button title={'Add Another Choice'} variant='outlined' color='primary' onClick={() => props.addOption()}>
            <AddCircleOutlined style={{marginRight: '5px'}}/><Typography color={'primary'}>Add Choice</Typography>
          </Button>
        </div>
      </div>
  )
}

function Checkbox(props) {
  return (
      <div className="mc-grid">
        {props.data.map((value, index) =>
            <div className="question-container" key={index}>

              <CB className="checkbox-input" disabled type="checkbox" value={value} key={index}/>

              <input
                  type="text"
                  key={index}
                  value={value}
                  className="checkbox-choice"
                  onChange={(event) => props.changeData(event, index)}
              />
              <IconButton title={'Remove \'' + value + '\''} onClick={() => props.removeOption(index)}
                          color={'primary'}>
                <BackspaceOutlined/>
              </IconButton>
            </div>
        )}
        <div>
          <Button title={'Add Another Choice'} variant='outlined' color='primary' onClick={() => props.addOption()}>
            <AddCircleOutlined style={{marginRight: '5px'}}/><Typography color={'primary'}>Add Choice</Typography>
          </Button>
        </div>
      </div>
  )
}

export {Checkbox, Dropdown, MultipleChoice, Rating, ShortAnswer, TrueFalse}