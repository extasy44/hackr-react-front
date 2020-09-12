import { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Layout from '../../../components/Layout';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';
import { API } from '../../../config';
import { updateUsers } from '../../../helpers/auth';
import CategoryFormBlock from '../../../components/block/CategoryFormBlock';
import withUser from '../../withUser';

const Profile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.name,
    email: user.email,
    password: '',
    error: '',
    success: '',
    buttonText: 'Update',
    categories: user.categories,
    disabled: false,
    loadedCategories: []
  });

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    categories,
    loadedCategories,
    disabled
  } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/category`);
    setState({ ...state, loadedCategories: response.data });
  };

  const handleCategoryToggle = (cid) => () => {
    //check if category id exist in the state
    const clickedCategory = categories.indexOf(cid);
    const all = [...categories];

    if (clickedCategory === -1) {
      all.push(cid);
    } else {
      all.splice(clickedCategory, 1);
    }

    setState({ ...state, categories: all, success: '', error: '' });
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: '',
      buttonText: 'Update'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: 'Updating..' });

    try {
      const response = await axios.put(
        `${API}/user`,
        {
          name,
          password,
          categories
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      updateUsers(response.data, () => {
        setState({
          ...state,
          password: '',
          buttonText: 'Update',
          success: 'Profile has been updated'
        });
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: 'Update',
        error: error.response.data.error
      });
    }
  };

  const UpdateForm = () => (
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
          disabled
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
      <hr />
      <h4 className="mt-2 mb-2">Topics you are interested</h4>
      <div className="form-group">
        <ul
          style={{
            maxHeight: '250px',
            overflowY: 'scroll'
          }}
        >
          <CategoryFormBlock
            categories={categories}
            loadedCategories={loadedCategories}
            onClick={handleCategoryToggle}
          />
        </ul>
      </div>
      <hr />
      <div className="form-group">
        <button className="btn btn-outline-primary"> {buttonText} </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div
        className="col-md-6 offset-md-3 p-4 bg-light"
        style={{ border: '1px solid grey', borderRadius: '20px' }}
      >
        <h2>Update Profile</h2>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(('error : ', error))}
        {UpdateForm()}
      </div>
    </Layout>
  );
};

export default withUser(Profile);
