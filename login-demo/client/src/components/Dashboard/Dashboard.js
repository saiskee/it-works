import React, {Component} from "react";
import {connect} from "react-redux";
import {logout, getSurveys} from "../../actions/session";
import {Card,CardContent, Divider, CardHeader, TableBody, TableCell, TableRow, TableHead, Table, Button} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';


const statusColors = {
  delivered: 'success',
  pending: 'info',
  refunded: 'danger'
};

// This fn takes a piece of the main application "store" and passes it into the component
// In this case, we just want state.session, so we are accessing just that
const mapStateToProps = ({ session, surveys }) => ({
  session, // this puts session as a prop
  surveys
});


const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()), // This puts logout as a prop for the component
  getSurveys: () => dispatch(getSurveys())
});



class Dashboard extends Component{

  componentDidMount() {
    this.props.getSurveys();
  }

  render(){
    const {logout, session, surveys} = this.props;
    return (
      <>
        <h1>Hi {session.fullName}, Here are your surveys:</h1>

        <button onClick={logout}>Logout</button>
        <Card>
          <CardHeader title={"Card header"}>

          </CardHeader>
          <Divider/>
          <CardContent>
            <PerfectScrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Survey ID
                    </TableCell>
                    <TableCell>
                      Survey Creation Date
                    </TableCell>
                    <TableCell>
                      Survey Expiry Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveys.surveys.map(survey => (
                      <TableRow key={survey._id} >
                        <TableCell >
                          <Link to={'/survey'}>{survey._id}</Link>

                        </TableCell>
                        <TableCell >
                          {survey.creation_date}
                        </TableCell>
                        <TableCell>
                          {survey.expiry_date}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PerfectScrollbar>
          </CardContent>


        </Card>
      </>

    );
  }

}


export default connect(
  mapStateToProps, // This passes in our mapStateToProps function as a prop into our Dashboard component
  mapDispatchToProps
)(withRouter(Dashboard));