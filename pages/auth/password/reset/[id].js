import { useState, useEffect } from 'react';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import {
  showSuccessMessage,
  showErrorMessage
} from '../../../../helpers/alert';
import { API } from '../../../../config';

import Layout from '../../../../components/Layout';

const ResetPassword = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    newPassword: '',
    buttonText: 'Reset Password',
    success: '',
    error: ''
  });

  const { name, token, newPassword, buttonText, success, error } = state;

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);
    if (decoded)
      setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword
      });

      setState({ ...state, buttonText: 'Sending' });

      setState({
        ...state,
        newPassword: '',
        buttonText: 'Done',
        success: response.data.message
      });
    } catch (error) {
      console.log('RESET PASSWORD ERROR', error);
      setState({
        ...state,
        buttonText: 'Reset Password',
        error: error.response.data.error
      });
    }
  };

  const ForgotPasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeholder="new password*"
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
          <h2>Hi, {name} ready to reset password?</h2>
          <hr />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {ForgotPasswordForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
