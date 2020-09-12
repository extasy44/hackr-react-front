import { useState } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';
import { API } from '../../../config';
import Layout from '../../../components/Layout';

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: '',
    buttonText: 'Send Reset Link',
    success: '',
    error: ''
  });

  const { email, buttonText, success, error } = state;
  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API}/forgot-password`, { email });

      setState({
        ...state,
        email: '',
        buttonText: 'Done',
        success: response.data.message
      });
    } catch (error) {
      console.log('FORGOT PASSWORD ERROR', error);
      setState({
        ...state,
        email: '',
        buttonText: 'Send Reset Link',
        error: error.response.data.error
      });
    }
  };

  const ForgotPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeholder="Type your email"
          required
        />
      </div>
      <button className="btn btn-outline-primary btn-block">
        {buttonText}
      </button>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-9 offset-md-1">
          <h2>Forgot Password</h2>
          <hr />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {ForgotPasswordForm()}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
