import React, {Component} from 'react';
import {Grid, Table, Typography, Card, TableHead, TableRow, TableBody, TableCell, IconButton} from '@material-ui/core';
import {TrendingUp} from '@material-ui/icons';
import {connect} from "react-redux";
import {getSurveyAndResponses} from "../../actions/analytics";
import {withRouter} from "react-router-dom";
import {visualizeCurrentData, visualizeTrendData} from "./visualizers";
import moment from "moment";

const mapStateToProps = ({survey}) => ({
  survey
});

const mapDispatchToProps = dispatch => ({
  getSurvey: (surveyId) => dispatch(getSurveyAndResponses(surveyId)),
  //TODO: Clear store for survey / analytics

});



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

  surveyCompletionStatus(survey){
    const {assigned_to} = survey;
    const completion_number = assigned_to.reduce((acc, obj) => (obj.completion_status === 'Finished' ? acc +1 : acc), 0);
    console.log(completion_number);
    return String(Math.floor(completion_number * 100/assigned_to.length)) + "% (" + String(assigned_to.length - completion_number) + " incomplete)";
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
          <Grid item sm={12} md={12} lg={12}>

              {survey.survey_template.title &&
              <Card style={classes.root}>
              <Typography variant={'h2'}>{survey.survey_template.title}</Typography>
                <Table style={{marginTop: '5px'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Start Date
                      </TableCell>
                      <TableCell>
                        Expiry Date
                      </TableCell>
                      <TableCell>
                        Survey Participation
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {moment(survey.start_date).format('MM/DD/YYYY hh:mm a')}
                      </TableCell>
                      <TableCell>
                        {moment(survey.expiry_date).format('MM/DD/YYYY hh:mm a')}
                      </TableCell>
                      <TableCell>
                        {this.surveyCompletionStatus(survey)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              }


          </Grid>
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
                          <IconButton title={'Show Trend Analytics for this Question'} color={'primary'} style={classes.analyticsButton} onClick={() => {this.handleTrendShowChange(question, index);}}>
                            <TrendingUp color={'primary'}/>
                          </IconButton>
                        </div>
                        <Typography variant={'h1'}>{question.title ? question.title : question.name}</Typography>
                        <Typography variant={'h5'}>{question.type}</Typography>
                        {question.analytics && !this.state.showTrendObject[question.question_id._id] && visualizeCurrentData(question, this.state.surveyId)}
                        {question.analytics && this.state.showTrendObject[question.question_id._id] && visualizeTrendData(question, this.state.surveyId)}
                        {!question.analytics && <Typography variant={'subtitle1'} color={'primary'} style={{marginTop: '15px'}}>No Analytics to Display Yet!</Typography>}
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
