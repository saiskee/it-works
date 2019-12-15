import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {Bar, Line} from "react-chartjs-2";
import React from "react";
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
    console.log(analytics);
    console.log(choice_analytics);

    let data = {
      labels: dates.map(date => date===analytics[currentSurveyId].expiry ? 'Current Survey' : moment(date).format('MM-DD-YYYY')),
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

const visualizeCurrentData = (question, currentSurveyId) => {
  const {analytics} = question;
  if (!analytics) return;
  if (question.type === "text" || question.type === 'comment') {
    return (

        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                Responses
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

    )
  }
  if (['checkbox', 'radiogroup', 'dropdown'].includes(question.type)) {
    if (!question.analytics.hasOwnProperty(currentSurveyId)){
      return;
    }
    let data = {
      labels: Object.keys(question.analytics[currentSurveyId].answers),
      datasets: [{
        label: "Current Survey (" +moment(question.analytics[currentSurveyId].expiry).format('MM-DD-YYYY') + ")" ,
        data: Object.values(question.analytics[currentSurveyId].answers),
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
        </>
    );
  }
  if (question.type === "rating") {
    let data = {
      labels: Object.keys(question.analytics[currentSurveyId].answers),
      datasets: [{
        label: "Survey " + currentSurveyId,
        data: Object.values(question.analytics[currentSurveyId].answers)
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
        </>
    );
  }
};

export {visualizeCurrentData, visualizeTrendData}