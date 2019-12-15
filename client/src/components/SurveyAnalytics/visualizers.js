import {Table, TableBody, TableCell, TableHead, TableRow, Slider} from "@material-ui/core";
import {Bar, Line} from "react-chartjs-2";
import React, {useState} from "react";
import moment from 'moment';

const visualizeTrendData = (question, currentSurveyId) => {
  const {analytics} = question;
  const dates = Object.keys(analytics).map(survey_id => analytics[survey_id].expiry);
  if (question.type === "text" || question.type === 'comment') {
    return (
        <>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  Current Survey Responses
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.hasOwnProperty(currentSurveyId) && analytics[currentSurveyId].answers.length > 0 && analytics[currentSurveyId].answers.map((response, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {JSON.stringify(response)}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>

          </Table>
          {Object.keys(analytics).map(surveyId => (surveyId !== currentSurveyId &&
              (<Table><TableHead>
                <TableRow>
                  <TableCell>
                    Survey {surveyId} responses
                  </TableCell>
                </TableRow>
              </TableHead>
                <TableBody>
                  {analytics.hasOwnProperty(surveyId) && analytics[surveyId].length > 0 && analytics[surveyId].map((response, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {JSON.stringify(response)}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody></Table>)
          ))}
        </>
    );
  }
  if (['checkbox', 'radiogroup', 'dropdown'].includes(question.type)) {
    const choice_analytics = {}

    for (const survey_id in analytics) {
      const survey_analytics = analytics[survey_id].answers;
      for (const choice in survey_analytics) {
        if (choice_analytics.hasOwnProperty(choice)) {
          choice_analytics[choice][survey_id] = survey_analytics[choice];
        } else {
          choice_analytics[choice] = {};
          choice_analytics[choice][survey_id] = survey_analytics[choice];
        }
      }
    }


    let data = {
      labels: dates.map(date => date === analytics[currentSurveyId].expiry ? 'Current Survey' : moment(date).format('MM-DD-YYYY')),
      datasets: Object.keys(choice_analytics).map((choice, index) => ({
        label: choice,
        data: dates.slice().map(date => {
          let surveyId = (Object.keys(choice_analytics[choice]).find(surveyId =>
              (analytics[surveyId].expiry == date)
          ));

          return surveyId ? choice_analytics[choice][surveyId] : 0
        }),
        fill: false,
        borderColor: ['#389E3CCA', '#979e38CA', '#c97c34CA', '#c93634CA', '#c934c4CA', '#cf2368CA'][index]
      }))
    };
    let options = {
      scales: {
        yAxes: [{ticks: {beginAtZero: true}}]
      }
    }
    return (
        <>
          <Line data={data} options={options}/>
        </>
    );
  }
  if (question.type === "rating") {
  }
}

const VisualizeCurrentData = ({question, currentSurveyId}) => {
  let currentDateIndex = 0;
  const {analytics} = question;
  const dates = Object.keys(analytics).map(survey_id => ({
    survey_id,
    date: analytics[survey_id].expiry
  })).sort(obj => -obj.date);
  const marks = dates.map((obj, index) => {
    if (obj.survey_id === currentSurveyId){
      currentDateIndex = index;
    }
    return {
      value: index,
      label: obj.survey_id === currentSurveyId ? "Current Survey" : moment(obj.date).format('MM-DD-YYYY')
    }
  });


  const [surveyToDisplay, setSurvey] = useState(currentSurveyId);
  const [surveyIndex, setSurveyIndex] = useState(currentDateIndex);
  if (!analytics) {
    return (<></>)
  };



  function handleSliderChange(event, index) {
    if (dates[index].survey_id !== surveyToDisplay) {
      setSurveyIndex(index);
      setSurvey(dates[index].survey_id)
    }
  }

  const SurveySlider = () => {
    return (
        <Slider marks={marks} step={null} min={-1} defaultValue={surveyIndex} max={dates.length}
                onChange={handleSliderChange}/>
    );
  };


  if (question.type === "text" || question.type === 'comment') {
    return (
        <>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  Responses
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.hasOwnProperty(surveyToDisplay) && analytics[surveyToDisplay].answers.length > 0 && analytics[surveyToDisplay].answers.map((response, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      {JSON.stringify(response)}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
          <SurveySlider/>
        </>
    )
  }
  if (['checkbox', 'radiogroup', 'dropdown'].includes(question.type)) {
    if (!question.analytics.hasOwnProperty(surveyToDisplay)) {
      return;
    }
    let data = {
      labels: Object.keys(question.analytics[surveyToDisplay].answers),
      datasets: [{
        label: moment(question.analytics[surveyToDisplay].expiry).format('MM-DD-YYYY'),
        data: Object.values(question.analytics[surveyToDisplay].answers),
        backgroundColor: ['#389E3CCA', '#388E3CCA', '#387E3CCA', '#386E3CCA', '#385E3CCA', '#384E3CCA']
      }],
    };
    let options = {
      scales: {
        yAxes: [{ticks: {beginAtZero: true}}]
      }
    }
    return (
        <>
          <Bar data={data} options={options}/>
          <SurveySlider/>
        </>
    );
  }
  if (question.type === "rating") {
    let data = {
      labels: Object.keys(question.analytics[surveyToDisplay].answers),
      datasets: [{
        label: "Survey " + surveyToDisplay,
        data: Object.values(question.analytics[surveyToDisplay].answers),
        backgroundColor: ['#389E3CCA', '#388E3CCA', '#387E3CCA', '#386E3CCA', '#385E3CCA', '#384E3CCA']
      }],
    };
    let options = {
      scales: {
        yAxes: [{ticks: {beginAtZero: true}}]
      },

    }
    return (
        <>
          <Bar data={data} options={options}/>
          <SurveySlider/>
        </>
    );
  }
};


export {VisualizeCurrentData, visualizeTrendData}