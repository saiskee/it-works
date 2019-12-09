import React, {Component} from "react";
import {connect} from "react-redux";
import {getSurveys} from "../../actions/survey";
import PerfectScrollbar from "react-perfect-scrollbar";
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
import {Image} from "@material-ui/icons";

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


class Dashboard extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.getSurveys();
  }

  renderProfileCard = () => {
    let styles = {
      profileCard : {
        padding: '50px',
      },
      logo:{
        width: '100px',
        height: '100px',
        marginBottom: '10%'
      }

    };
    function calculateLoyalty(startDate){
      return Math.floor(moment.duration(moment().diff(moment(startDate))).as('days'));
    }
    const {fullName, positionTitle, companyName, startDate} = this.props.session;

    return(

    <Card style={styles.profileCard}>
      <img style={styles.logo} src={logo}/>
      <Typography variant={'h2'}>{fullName}</Typography>
      <Typography variant={'subtitle2'}>{companyName}, {positionTitle}</Typography>
      <Typography variant={'body2'}>You've been with {companyName} for {calculateLoyalty(startDate)} days!</Typography>
    </Card>
    );
  }

  render() {
    const {surveys} = this.props;
    return (
        <>
          <Grid container direction={'row'}  justify={'space-around'}>
            <Grid item lg={3} md={3} xl={9} xs={12}>
            {this.renderProfileCard()}
            </Grid>
            <Grid item lg={8} md={8} xl={9} xs={12}>
            <Paper>

              <Table style={{minWidth: '50vw'}}>
                <TableHead>
                  <TableRow>

                    <TableCell>
                      Survey Name
                    </TableCell>
                    <TableCell>
                      Survey Creation Date
                    </TableCell>
                    <TableCell>
                      Survey Expiry Date
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
                              to={survey_object.survey_status === 'Unfinished' ? '/survey/' + survey_object.survey._id : '/dashboard'}
                              color={'primary'}
                          >{survey_object.survey.survey_template.title ? survey_object.survey.survey_template.title : "Survey"}</Link>
                        </TableCell>
                        <TableCell>
                          <Typography variant={'subtitle1'}>{moment(survey_object.survey.start_date).format('MM/DD/YYYY hh:mm a')}</Typography>
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
                      <Typography variant={'h5'}>No surveys to display</Typography></TableCell>
                  </TableRow>}

                </TableBody>
              </Table>


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
)(withRouter(Dashboard));
