import React, {Component} from "react";
import {connect} from "react-redux";

import {getManagerAuthoredSurveys} from "../../actions/analytics";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Link, withRouter} from 'react-router-dom';
import {
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  Grid,
  Paper,
  Typography, Button,
} from "@material-ui/core";
import {getEmployees} from "../../actions/employee";

/**
 * This fn takes a piece of the main application "store" and passes it into the component
 * In this case, we just want state.session, so we are accessing just that
 */
const mapStateToProps = ({ authoredSurveys, employees}) => ({
  authoredSurveys,
  employees
});

const mapDispatchToProps = dispatch => ({
  getManagerAuthoredSurveys: () => dispatch(getManagerAuthoredSurveys()),
  getEmployees: () => dispatch(getEmployees())
});



class ManagerDashboard extends Component {

  componentDidMount() {
    this.props.getManagerAuthoredSurveys();
    this.props.getEmployees();
  }

  render() {
    const {authoredSurveys} = this.props;
    return (
        <>


          <Grid container direction={'column'} alignItems={'center'} justify={'center'}>
            <Paper>
              {/*<PerfectScrollbar>*/}
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
                    {authoredSurveys.surveys.map((survey_object) => (
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
                            {Math.floor(Math.random() * 100)}%
                            {/*<Typography variant={'subtitle1'}>{survey_object.survey_status}</Typography>*/}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </Paper>
                <div style={{paddingTop: '5vh', paddingBottom: '10px', alignSelf:'start'}}><Typography variant={'h2'}>Employees</Typography></div>
            <Paper>
                <Table style={{minWidth: '90vw'}}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        Employee Name
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.employees.map((employee) => (
                        <TableRow key={employee.empId}>
                          <TableCell>
                            <Typography>{employee.fullName}</Typography>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              {/*</PerfectScrollbar>*/}
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
