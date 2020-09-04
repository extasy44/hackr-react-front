import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Layout from '../components/Layout';
import { showSuccessMessage, showErrorMessage } from '../helpers/alert';
import { API } from '../config';
import { isAuth } from '../helpers/auth';

const Register = () => {
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: '',
    buttonText: 'Register'
  });

  useEffect(() => {
    isAuth() && Router.push('/');
  }, []);

  const { name, email, password, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Register'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Registering' });

    try {
      const response = await axios.post(`${API}/register`, {
        name,
        email,
        password
      });

      console.log(response);
      setState({
        name: '',
        email: '',
        password: '',
        buttonText: 'Submitted',
        success: response.data.message
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: 'Register',
        error: error.response.data.error
      });
    }
  };

  const RegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="name"
          required
        />
      </div>
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
        <h2>Register</h2>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(('error : ', error))}
        {RegisterForm()}
      </div>
    </Layout>
  );
};

export default Register;
