import React, {Component, useEffect} from 'react';
import {Grid, Table, Typography, Card, TableHead, TableRow, TableBody, TableCell, IconButton} from '@material-ui/core';
import {TrendingUp} from '@material-ui/icons';
import {connect} from "react-redux";
import {getSurveyAndResponses} from "../../actions/analytics";
import {withRouter} from "react-router-dom";
import {visualizeCurrentData, visualizeTrendData} from "./visualizers";

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


class SurveyAnalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surveyId: props.match.params.surveyId,
      showTrendObject: {}
    }
  }

  componentDidMount() {
    console.log("Survey Analytics for Survey " + this.state.surveyId + " Mounted");
    this.props.getSurvey(this.state.surveyId);
  }

  componentWillUnmount() {
  }

  handleTrendShowChange(question, index) {
    const question_id = question.question_id._id;
    this.setState((prevState) => {
      prevState.showTrendObject[question_id] = prevState.showTrendObject[question_id] ? false : true;
      return {
      showTrendObject: prevState.showTrendObject
    }});
    console.log(question_id);
  }

  render() {
    const {survey} = this.props.survey
    const classes = {
      root:{ padding: '4%'},
      analyticsButton: {
        right: '-45%',
      }
    }
    return (
        <div style={classes.root}>
          <Grid
              container
              spacing={4}
          >

            {survey.survey_template.pages && survey.survey_template.pages.map((page, p_index) => (
                page.elements.map((question, index) => (
                    <Grid
                        item
                        lg={6}
                        md={12}
                        xl={9}
                        xs={12}
                        key={question.question_id._id}
                    >
                      <Card style={classes.root}>
                        <div width={'100%'}>
                          <IconButton color={'primary'} style={classes.analyticsButton} onClick={() => {this.handleTrendShowChange(question, index);}}>
                            <TrendingUp color={'primary'}/>
                          </IconButton>
                        </div>
                        <Typography variant={'h1'}>{question.title ? question.title : question.name}</Typography>
                        <Typography variant={'h5'}>{question.type}</Typography>
                        {!this.state.showTrendObject[question.question_id._id] && visualizeCurrentData(question, this.state.surveyId)}
                        {this.state.showTrendObject[question.question_id._id] && visualizeTrendData(question, this.state.surveyId)}
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
