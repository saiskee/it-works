import React, {Component} from "react";
import {connect} from "react-redux";
import {getSurveys} from "../../actions/survey";
import {Link, withRouter} from 'react-router-dom';
import moment from 'moment';
import logo from './logo512.jpeg';
import {
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  Grid,
  Paper,
  Typography,
  Card
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

/**
 * This fn takes a piece of the main application "store" and passes it into the component
 * In this case, we just want state.session, so we are accessing just that
 */
const mapStateToProps = ({surveys, session}) => ({
  surveys,
  session
});

const mapDispatchToProps = dispatch => ({
  getSurveys: (component) => dispatch(getSurveys(component))
});

const styles = theme => ({
  profileCard: {
    padding: '50px',
    backgroundColor: theme.palette.background
  },
  logo: {
    width: '100px',
    height: '100px',
    marginBottom: '10%'
  }
})

class Dashboard extends Component {

  componentDidMount = () => {
    this.props.getSurveys();
  }

  renderProfileCard = () => {
    const {classes} = this.props;

    function calculateLoyalty(startDate) {
      return Math.floor(moment.duration(moment().diff(moment(startDate))).as('days'));
    }

    const {fullName, positionTitle, companyName, startDate} = this.props.session;

    return (

        <Card className={classes.profileCard}>
          <img alt={'Profile Picture'} className={classes.logo} src={logo}/>
          <Typography variant={'h2'}>{fullName}</Typography>
          <Typography variant={'subtitle2'}>{companyName}, {positionTitle}</Typography>
          <Typography variant={'body2'}>You've been
            with {companyName} for {calculateLoyalty(startDate)} days!</Typography>
        </Card>
    );
  }

  render() {
    const {surveys} = this.props;
    return (
        <>
          <Grid container direction={'row'} justify={'space-around'}>
            <Grid item lg={3} md={3} xl={9} xs={12}>
              {this.renderProfileCard()}
            </Grid>
            <Grid item lg={8} md={8} xl={9} xs={12}>
              <Paper>
                <div style={{maxHeight: '86vh', overflow: 'auto'}}>
                  <Table style={{minWidth: '50vw'}} stickyHeader>
                    <TableHead>
                      <TableRow>

                        <TableCell>
                          Survey Name
                        </TableCell>
                        <TableCell>
                          Survey Open Date
                        </TableCell>
                        <TableCell>
                          Survey Close Date
                        </TableCell>
                        <TableCell>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {surveys.surveys.map((survey_object) => (
                          <TableRow key={survey_object.survey._id}>

                            <TableCell>
                              <Link
                                  to={survey_object.survey_status !== 'Unfinished' ?  '/dashboard' : '/survey/' + survey_object.survey._id}
                                  color={'primary'}
                              ><Typography variant={'subtitle1'} color={'primary'}>{survey_object.survey.survey_template.title ? survey_object.survey.survey_template.title : "Survey"}</Typography></Link>
                            </TableCell>
                            <TableCell>
                              <Typography
                                  variant={'subtitle1'}>{moment(survey_object.survey.start_date).format('MM/DD/YYYY hh:mm a')}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                  variant={'subtitle1'}>{moment(survey_object.survey.expiry_date).format('MM/DD/YYYY hh:mm a')}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant={'subtitle1'}>{survey_object.survey_status}</Typography>
                            </TableCell>
                          </TableRow>
                      ))}
                      {surveys.surveys.length < 1 &&
                      <TableRow>
                        <TableCell>
                          <Typography variant={'h5'}>No Surveys Assigned</Typography></TableCell>
                      </TableRow>}

                    </TableBody>
                  </Table>

                </div>
              </Paper>
            </Grid>
          </Grid>
        </>

    );
  }

}


export default connect(
    mapStateToProps, // This passes in our mapStateToProps function as a prop into our Dashboard component
    mapDispatchToProps
)(withStyles(styles)(withRouter(Dashboard)));
