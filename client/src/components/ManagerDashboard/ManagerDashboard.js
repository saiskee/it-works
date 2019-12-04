import React, {Component} from "react";
import {connect} from "react-redux";

import {getManagerAuthoredSurveys} from "../../actions/analytics";
import {Link, withRouter} from 'react-router-dom';
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
import {getEmployees} from "../../actions/employee";
import {Doughnut} from "react-chartjs-2";

/**
 * This fn takes a piece of the main application "store" and passes it into the component
 * In this case, we just want state.session, so we are accessing just that
 */
const mapStateToProps = ({authoredSurveys, employees}) => ({
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

  surveyCompletionPercentage(survey) {
    const {assigned_to} = survey;
    let users_finished = 0;
    let users_unfinished = 0;
    assigned_to.forEach(obj => {
      if (obj.completion_status === 'Finished') {
        users_finished++
      }else{
        users_unfinished++;
      }
    });
    let data = {
      datasets: [{
        data: [users_finished, users_unfinished],
        backgroundColor: ["#4caf50", "#af584c"],
        borderWidth: 0.5,
      }],
      labels: ['Finished', 'Unfinished']
    };

    let options = {
      legend: {
        display: false
      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        // Disable the on-canvas tooltip
        enabled: false,

        custom: function(tooltipModel) {
          // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip');

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<table></table>';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add('no-transform');
          }

          function getBody(bodyItem) {
            return bodyItem.lines;
          }

          // Set Text
          if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            var bodyLines = tooltipModel.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function(title) {
              innerHtml += '<tr><th>' + title + '</th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function(body, i) {
              var colors = tooltipModel.labelColors[i];
              var style = 'background:' + colors.backgroundColor;
              style += '; border-color:' + colors.borderColor;
              style += '; border-width: 2px';
              var span = '<span style="' + style + '"></span>';
              innerHtml += '<tr><td>' + span + body + '</td></tr>';
            });
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
          }

          // `this` will be the overall tooltip
          var position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.pointerEvents = 'none';
        }
      }
    }

    return <Doughnut  data={data} options={options}/>;
  }

  render() {
    const {authoredSurveys} = this.props;
    return (
        <>
          <Grid container direction={'column'} alignItems={'center'} justify={'center'}>
            <Paper>
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
                      Completion
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {authoredSurveys.surveys.map((survey_object) => (
                      <TableRow key={survey_object._id}>
                        <TableCell>
                          <Typography variant={'subtitle1'}>{survey_object._id}</Typography>
                        </TableCell>
                        <TableCell>
                          <Link
                              to={"/analytics/" + survey_object._id}>{survey_object.survey_template.title ? survey_object.survey_template.title : "Survey"}</Link>
                        </TableCell>
                        <TableCell>
                          <Typography variant={'subtitle1'}>{survey_object.creation_date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant={'subtitle1'}>{survey_object.expiry_date}</Typography>
                        </TableCell>
                        <TableCell style={{maxWidth: '50px', maxHeight: '50px'}}>
                          {this.surveyCompletionPercentage(survey_object)}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
            <div style={{paddingTop: '5vh', paddingBottom: '10px', alignSelf: 'start'}}><Typography
                variant={'h2'}>Employees</Typography></div>
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
