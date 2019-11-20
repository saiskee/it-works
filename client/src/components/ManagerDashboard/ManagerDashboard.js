import React, {Component} from "react";
import {connect} from "react-redux";

import {getManagerAuthoredSurveys} from "../../actions/analytics";
import PerfectScrollbar from "react-perfect-scrollbar";
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  Grid,
  Paper,
  Typography,
  makeStyles
} from "@material-ui/core";

/**
 * This fn takes a piece of the main application "store" and passes it into the component
 * In this case, we just want state.session, so we are accessing just that
 */
const mapStateToProps = ({session, surveys}) => ({
  session, // this puts session as a prop
  surveys
});

const mapDispatchToProps = dispatch => ({
  getManagerAuthoredSurveys: () => dispatch(getManagerAuthoredSurveys())
});



class ManagerDashboard extends Component {

  componentDidMount() {
    this.props.getManagerAuthoredSurveys();
  }

  render() {
    const {session, surveys} = this.props;
    return (
        <>


          <Grid container direction={'column'} alignItems={'center'} justify={'center'}>
            <Paper>
              <PerfectScrollbar>
                <Table style={{minWidth: '90vw'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Survey ID
                      </TableCell>
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
                        <TableRow key={survey_object._id}>
                          <TableCell>
                            <Typography variant={'subtitle1'} >{survey_object._id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Link to={"/analytics/" + survey_object._id}>{survey_object.survey_template.title ? survey_object.survey_template.title : "Survey"}</Link>
                          </TableCell>
                          <TableCell>
                            <Typography variant={'subtitle1'}>{survey_object.creation_date}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant={'subtitle1'}>{survey_object.expiry_date}</Typography>
                          </TableCell>
                          <TableCell>
                            {/*<Typography variant={'subtitle1'}>{survey_object.survey_status}</Typography>*/}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </Paper>
          </Grid>
        </>

    );
  }

}


export default connect(
    mapStateToProps, // This passes in our mapStateToProps function as a prop into our Dashboard component
    mapDispatchToProps
)(withRouter(ManagerDashboard));
