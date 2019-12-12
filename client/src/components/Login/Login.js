import React, { useState} from "react";

import Logo from "./logo.png";
import "./Login.css";
import {connect} from 'react-redux';
import { login } from '../../actions/session';
import {Link} from 'react-router-dom';

const mapStateToProps = ({ errors }) => ({
  errors
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(login(user))
});



const Login = ({errors, login}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState(false);

  

  const handleSubmit= (event) => {
    event.preventDefault();
    console.log("THIS IS A TEST");
    login({username: email, password: password});
  }

  return (
    <div id="login-page">
      <div className="login">
        <img src={Logo} alt="It Works Logo" className="logo"  />
        <form onSubmit = {handleSubmit} className="form-login">
          <label> E-mail</label>
          <div className="input-email">
            <i className="fas fa-envelope icon"></i>
            <input type="email" placeholder="type your e-mail" value={email} onChange={e => {setEmail(e.target.value)}} />
          </div>
          <label> Password</label>
          <div className="input-password">
            <i className="fas fa-lock icon"></i>
            <input type="password" placeholder="type your password" value={password} onChange={e => {setPassword(e.target.value)}} />
          </div>
          <p id="login_result">{errors}</p>
          <button type="submit" id="login_submit">Login</button>
        <Link to="/register">Don't have an account? Register!</Link>
        </form>
      </div>
      <div className="background">
        <div style={{background: 'rgba(5,100,0,0.1)', padding: '40px', borderRadius: '15px'}}>
        <h1>Log in to the It Works Survey Management Tool</h1>
        <p>Create surveys, participate in them, and track survey analytics over time</p>
      </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
