import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';
import withUser from '../../withUser';

import Layout from '../../../components/Layout';
import { getCookie, isAuth } from '../../../helpers/auth';

const Update = ({ oldLink, token }) => {
  const [state, setState] = useState({
    title: oldLink.title,
    url: oldLink.url,
    categories: oldLink.categories,
    loadedCategories: [],
    error: '',
    success: '',
    buttonText: 'Update',
    type: oldLink.type,
    medium: oldLink.medium,
    level: oldLink.level
  });

  const {
    title,
    url,
    categories,
    loadedCategories,
    error,
    success,
    type,
    medium,
    level
  } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/category`);
    setState({ ...state, loadedCategories: response.data });
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((category) => (
        <li className="list-unstyled" key={category._id}>
          <input
            type="checkbox"
            onChange={handleCategoryToggle(category._id)}
            className="mr-2"
            checked={categories.includes(category._id)}
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
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

  const showTypes = () => (
    <React.Fragment>
      <div className="form-check pl-5">
        <label className="form-check-label ml-2">
          <input
            name="type"
            type="radio"
            onClick={handleTypeClick}
            checked={type === 'free'}
            value="free"
            className="form-check-input"
          />
          Free
        </label>{' '}
        <br />
        <label className="form-check-label ml-2">
          <input
            name="type"
            type="radio"
            onClick={handleTypeClick}
            checked={type === 'paid'}
            value="paid"
            className="form-check-input"
          />
          Paid
        </label>
      </div>
    </React.Fragment>
  );

  const showMedium = () => (
    <React.Fragment>
      <div className="form-check pl-5">
        <label className="form-check-label ml-2">
          <input
            name="medium"
            type="radio"
            onClick={handleMediumClick}
            checked={medium === 'video'}
            value="video"
            className="form-check-input"
          />
          Video
        </label>{' '}
        <br />
        <label className="form-check-label ml-2">
          <input
            name="medium"
            type="radio"
            onClick={handleMediumClick}
            checked={medium === 'book'}
            value="book"
            className="form-check-input"
          />
          Book
        </label>
      </div>
    </React.Fragment>
  );

  const showLevel = () => (
    <React.Fragment>
      <div className="form-check pl-5">
        <label className="form-check-label ml-2">
          <input
            name="level"
            type="radio"
            onClick={handleLevelClick}
            checked={level === 'beginner'}
            value="beginner"
            className="form-check-input"
          />
          Beginner
        </label>{' '}
        <br />
        <label className="form-check-label ml-2">
          <input
            name="level"
            type="radio"
            onClick={handleLevelClick}
            checked={level === 'Advanced'}
            value="Advanced"
            className="form-check-input"
          />
          Advanced
        </label>
      </div>
    </React.Fragment>
  );

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: '', error: '' });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: '', error: '' });
  };

  const handleLevelClick = (e) => {
    setState({ ...state, level: e.target.value, success: '', error: '' });
  };

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, success: '', error: '' });
  };

  const handleURLChange = (e) => {
    setState({ ...state, url: e.target.value, success: '', error: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let updateUrl = `${API}/link/${oldLink._id}`;
    if (isAuth() && isAuth().role === 'admin') {
      updateUrl = `${API}/link/admin/${oldLink._id}`;
    }

    try {
      const response = await axios.put(
        updateUrl,
        {
          title,
          url,
          categories,
          type,
          medium,
          level
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setState({
        ...state,
        success: 'Tutoral/Course has been updated',
        error: ''
      });
    } catch (error) {
      console.log('Link submit error : ', error);
      setState({ ...state, error: error.response.data });
    }
  };

  const submitCourseForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          value={title}
          onChange={handleTitleChange}
          type="text"
          className="form-control"
          placeholder="title"
          required
        />
      </div>
      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          value={url}
          onChange={handleURLChange}
          type="text"
          className="form-control"
          placeholder="url"
          required
        />
      </div>
      <div className="form-group">
        <Link href="/user">
          <a className="btn btn-outline-secondary">Cancel</a>
        </Link>

        {isAuth() && token ? (
          <button
            disabled={!token}
            className="btn btn-outline-primary float-right"
          >
            {isAuth() || token ? 'Update' : 'Login to post'}
          </button>
        ) : (
          <div class="alert alert-danger" role="alert">
            You will need to login to update this tutorial
          </div>
        )}
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row mb-3">
        <div className="col-md-12">
          <h3>Update a Tutorial Link/URL</h3>
        </div>
      </div>
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      <div className="row">
        <div className="col-md-4">
          <div className="form-gorup">
            <label className="text-muted ml-4">
              Category <span className="text-primary">{categories.length}</span>
            </label>
            <ul
              style={{
                maxHeight: '150px',
                overflowY: 'scroll'
              }}
            >
              {showCategories()}
            </ul>
          </div>
          <div className="form-gorup">
            <label className="text-muted ml-4">Type</label>
            {showTypes()}
          </div>
          <br />
          <div className="form-gorup">
            <label className="text-muted ml-4">Medium</label>
            {showMedium()}
          </div>
          <br />
          <div className="form-gorup">
            <label className="text-muted ml-4">Level</label>
            {showLevel()}
          </div>
        </div>
        <div className="col-md-8">{submitCourseForm()}</div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, token, query }) => {
  const response = await axios.get(`${API}/link/${query.id}`);

  return { oldLink: response.data, token };
};

export default withUser(Update);
