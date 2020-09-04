import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';

import Layout from '../components/Layout';
import { showSuccessMessage, showErrorMessage } from '../helpers/alert';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Login'
  });

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

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

      setState({
        email: '',
        password: '',
        buttonText: 'Logged In',
        success: response.data.message
      });

      authenticate(response, () =>
        isAuth() && isAuth().role === 'admin'
          ? Router.push('/admin')
          : Router.push('/user')
      );
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
      <div
        className="col-md-6 offset-md-3 p-4 bg-light"
        style={{ border: '1px solid grey', borderRadius: '20px' }}
      >
        <h2>Login</h2>
        {JSON.stringify(isAuth())}
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {LoginForm()}
        <Link href="/auth/password/forgot">
          <a className="text-info float-right">Forgot Password</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
