import React, { useState } from "react";

import Logo from "./logo.png";
import "./Register.css";
import {signup} from '../../actions/session'
import {connect} from 'react-redux';
import {Link} from "react-router-dom";



const mapStateToProps = ({ errors }) => ({
  errors
});

const mapDispatchToProps = dispatch => ({
  signup: user => {console.log(user); dispatch(signup(user))}
});

const Register = ({history, errors, signup}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    signup({fullName: fullName, username: email, password: password});
    history.push('/login');
  }

  return (
    <div id="register-page">
      <div className="register">
        <img src={Logo} alt="It Works Logo" />
        <form onSubmit = {handleSubmit} className="form-register">
        <label htmlFor="name"> Full Name</label>
          <div className="input-email">
            <i className="fas fa-envelope icon"></i>
            <input id="name" type="text" placeholder="First / Last Name" value={fullName} onChange={e => {setFullName(e.target.value)}} />
          </div>
          <label htmlFor="email"> E-mail</label>
          <div className="input-email">
            <i className="fas fa-envelope icon"></i>
            <input id="email" type="email" placeholder="E-mail" value={email} onChange={e => {setEmail(e.target.value)}} />
            <span>{errors}</span>
          </div>
          <label htmlFor="password"> Password</label>
          <div className="input-password">
            <i className="fas fa-lock icon"></i>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => {setPassword(e.target.value)}} />
          </div>
          <p id="register_result"></p>
          <button type="submit" id="register_submit">Register</button>
          <Link to={'/login'}>Already have an account?</Link>
        </form>
      </div>
      <div className="background">
        <div style={{background: 'rgba(5,100,0,0.1)', padding: '40px', borderRadius: '15px'}}>
        <h1>Register an Account for It Works Survey Management Tool!</h1>
        <p>Create surveys, participate in them, and track survey analytics over time</p>
      </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps,  mapDispatchToProps)(Register)
