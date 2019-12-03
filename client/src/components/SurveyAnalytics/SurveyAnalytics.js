import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Table, Typography, Card, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core';
import {connect} from "react-redux";
import {getSurveyAndResponses} from "../../actions/analytics";
import {Bar} from "react-chartjs-2";
import {withRouter} from "react-router-dom";

const mapStateToProps = ({session, survey}) => ({
  session,
  survey
});

const mapDispatchToProps = dispatch => ({
  getSurvey: (surveyId) => dispatch(getSurveyAndResponses(surveyId))
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const visualizeData = (question, currentSurveyId) => {
  const {analytics} = question;
  console.log(question, currentSurveyId);
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
              {analytics[currentSurveyId].length > 0 && analytics[currentSurveyId].map(response => (
                  <TableRow>
                    <TableCell>
                      {JSON.stringify(response)}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        
    )
  }
  if (question.type === "checkbox" || question.type==='radiogroup') {
    let data = {
      labels: Object.keys(question.analytics[currentSurveyId]),
      datasets: [{
        label: "Survey " + currentSurveyId,
        data: Object.values(question.analytics[currentSurveyId])
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
      labels: Object.keys(question.analytics[currentSurveyId]),
      datasets: [{
        label: "Survey " + currentSurveyId,
        data: Object.values(question.analytics[currentSurveyId])
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
}

const SurveyAnalytics = (props) => {
  const {surveyId} = props.match.params;
  useEffect(() => {
        props.getSurvey(surveyId);
      },
      []);

  const classes = useStyles();
  const {survey} = props.survey
  return (
      <div className={classes.root}>
        <Grid
            container
            spacing={4}
        >

          {survey.survey_template.pages && survey.survey_template.pages.map((page) => (
              page.elements.map((question) => (
                  <Grid
                      item
                      lg={6}
                      md={12}
                      xl={9}
                      xs={12}
                  >
                    <Card className={classes.root}>
                      <Typography variant={'h1'}>{question.title ? question.title : question.name}</Typography>
                      <Typography variant={'h5'}>{question.type}</Typography>
                      {/*<Typography>{JSON.stringify(question.analytics)}</Typography>*/}
                      {visualizeData(question, surveyId)}
                      {/*<Bar data = {{labels: ['January', 'Middle','February'], datasets:[{data: [5,6,7], label: 'January'}]}}/>*/}
                    </Card>
                  </Grid>
              ))
          ))}


        </Grid>
      </div>
  );


};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SurveyAnalytics));
