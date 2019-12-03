import React, {Component} from 'react';
import ReactTags from 'react-tag-autocomplete';
import {getEmployees} from "../../actions/employee";
import {connect} from 'react-redux';
import './styles.css';

const mapStateToProps = ({employees}) => ({
  employees
});

const mapDispatchToProps = dispatch => ({
  getEmployees: (component) => dispatch(getEmployees(component))
});

class EmployeeSelector extends Component{

  constructor(props) {
    super(props);
    this.state = {
      tags: [

      ],
      suggestions: [

      ]
    }
  }

    handleDelete (i){
      const tags = this.state.tags.slice(0)
      tags.splice(i, 1)
      this.setState({ tags })
      this.props.handleEmployeeChange({tags});
    }

    handleAddition(tag){
      const tags = [].concat(this.state.tags, tag)
      this.setState({ tags })
      this.props.handleEmployeeChange({tags});
    }

  componentDidMount(){
    this.props.getEmployees();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const oldEmployees = prevProps.employees;
    const {employees} = this.props;
    // Find any employees that were not there in the previous render
    const newEmployees = employees.filter(newEmployee => (
        !oldEmployees.find(oldEmployee => (
          newEmployee.empId === oldEmployee.empId
      ))
    ));
    // add new employees to tags
    if (newEmployees.length > 0) {
      this.employeePropsToTags(newEmployees);
    }

  }

  employeePropsToTags(employees){
    employees.forEach(employee => {
      const suggestions = this.state.suggestions;
      suggestions.push({id: employee.empId, name: employee.fullName});
      this.setState({suggestions: suggestions});
    })
  }

  render(){
    return(<>
      <ReactTags
          placeholder={"Add employees to receive this survey"}
          minQueryLength={0}
          tags={this.state.tags}
          suggestions={this.state.suggestions}
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)} />
    </>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeSelector);