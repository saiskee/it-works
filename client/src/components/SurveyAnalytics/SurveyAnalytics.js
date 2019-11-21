import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import {connect} from "react-redux";
import {getSurveyAndResponses} from "../../actions/analytics";
import Card from "@material-ui/core/Card";

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

const SurveyAnalytics = (props) => {

  useEffect(() => {
    const {surveyId} = props.match.params;
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
                      <Typography>{JSON.stringify(question.survey_responses)}</Typography>
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
)(SurveyAnalytics);
