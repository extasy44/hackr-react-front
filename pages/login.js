import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';

import Layout from '../components/Layout';
import { showSuccessMessage, showErrorMessage } from '../helpers/alert';
import { API } from '../config';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Login'
  });

  const { email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Login'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Loggin In' });

    try {
      const response = await axios.post(`${API}/login`, {
        email,
        password
      });
      console.log(response);
      setState({
        email: '',
        password: '',
        buttonText: 'Logged In',
        success: response.data.message
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Login',
        error: error.response.data.error
      });
    }
  };

  const LoginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={email}
          onChange={handleChange('email')}
          type="email"
          className="form-control"
          placeholder="email"
          required
        />
      </div>
      <div className="form-group">
        <input
          value={password}
          onChange={handleChange('password')}
          type="password"
          className="form-control"
          placeholder="password"
          required
        />
      </div>
      <div className="form-group">
        <button className="btn btn-outline-dark"> {buttonText} </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Login</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {LoginForm()}
      </div>
    </Layout>
  );
};

export default Login;
