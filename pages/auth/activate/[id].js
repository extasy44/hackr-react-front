import { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';
import { API } from '../../../config';
import Layout from '../../../components/Layout';

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activate Account',
    success: '',
    error: '',
    buttonActive: true
  });

  const { name, token, buttonText, success, error, buttonActive } = state;

  useEffect(() => {
    let token = router.query.id;

    if (token) {
      const { name } = jwt.decode(token);
      setState({ ...state, name, token });
    }
  }, []);

  const clickSubmit = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      buttonText: 'Activating'
    });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });
      console.log('account activate response : ', response);
      setState({
        ...state,
        name: '',
        token: '',
        buttonText: 'Activated',
        buttonActive: false,

        success: response.data.message
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Activate Account',
        error: error.response.data.error
      });
    }
    //
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-9 offset-md-1">
          <h2>Hello, {name}. click to activate your account.</h2>
          <hr />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {buttonActive && (
            <button
              className="btn btn-outline-primary btn-block"
              onClick={clickSubmit}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
