import React, {Component, useEffect} from 'react';
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
  getSurvey: (surveyId) => dispatch(getSurveyAndResponses(surveyId)),
  //TODO: Clear store for survey / analytics

});

// const useStyles = makeStyles(theme => ({
//   root: {
//     padding: theme.spacing(4)
//   }
// }));

const visualizeData = (question, currentSurveyId) => {
  const {analytics} = question;
  // console.log(question, currentSurveyId);
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
              {analytics.hasOwnProperty(currentSurveyId) && analytics[currentSurveyId].length > 0 && analytics[currentSurveyId].map((response, idx) => (
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

class SurveyAnalytics extends Component {
  constructor(props){
    super(props);
    this.state = {
      surveyId : props.match.params.surveyId
    }
  }

  componentDidMount(){
    console.log("Survey Analytics for Survey "+this.state.surveyId+" Mounted");
    this.props.getSurvey(this.state.surveyId);
  }

  componentWillUnmount() {
  }

  render() {
    const {survey} = this.props.survey
    const classes = {
      root: {
        padding: '4%'
      }
    }
    return (
        <div style={classes.root} >
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
                        key={question.question_id}
                    >
                      <Card style={classes.root}>
                        <Typography variant={'h1'}>{question.title ? question.title : question.name}</Typography>
                        <Typography variant={'h5'}>{question.type}</Typography>
                        {visualizeData(question, this.state.surveyId)}
                      </Card>
                    </Grid>
                ))
            ))}


          </Grid>
        </div>
    );
  }


};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(SurveyAnalytics));
