import React, {Component} from "react";
import {connect} from "react-redux";
import {getSurveys} from "../../actions/survey";
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
} from "@material-ui/core";

/**
 * This fn takes a piece of the main application "store" and passes it into the component
 * In this case, we just want state.session, so we are accessing just that
 */
const mapStateToProps = ({surveys}) => ({
  surveys
});

const mapDispatchToProps = dispatch => ({
  getSurveys: (component) => dispatch(getSurveys(component))
});



class Dashboard extends Component {

  constructor(props){
    super(props);
  }

  componentDidMount = () => {
    this.props.getSurveys();
  }

  render() {
    const {surveys} = this.props;
    return (
        <>


          <Grid container direction={'column'} alignItems={'center'} justify={'center'}>
            <Paper>
              <PerfectScrollbar>
                <Table style={{minWidth: '95vw'}}>
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
                        <TableRow key={survey_object.survey._id}>
                          <TableCell>
                            <Typography variant={'subtitle1'} >{survey_object.survey._id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Link to={survey_object.survey_status === 'Unfinished'? '/survey/' + survey_object.survey._id : '/dashboard'}>{survey_object.survey.survey_template.title ? survey_object.survey.survey_template.title : "Survey"}</Link>
                          </TableCell>
                          <TableCell>
                            <Typography variant={'subtitle1'}>{survey_object.survey.creation_date}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant={'subtitle1'}>{survey_object.survey.expiry_date}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant={'subtitle1'}>{survey_object.survey_status}</Typography>
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
)(withRouter(Dashboard));
