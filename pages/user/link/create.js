import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';

import Layout from '../../../components/Layout';
import CategoryFormBlock from '../../../components/block/CategoryFormBlock';
import { getCookie, isAuth } from '../../../helpers/auth';

const Create = ({ token }) => {
  const [state, setState] = useState({
    title: '',
    url: '',
    categories: [],
    loadedCategories: [],
    error: '',
    success: '',
    buttonText: 'Submit',
    type: '',
    medium: '',
    level: ''
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
    console.table({ title, url, categories, type, medium, level });

    try {
      const response = await axios.post(
        `${API}/link`,
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
        title: '',
        url: '',
        success: 'Tutorial has been submitted',
        error: '',
        categories: [],
        type: '',
        medium: '',
        level: ''
      });
    } catch (error) {
      console.log('Link submit error : ', error);
      setState({ ...state, error: error.response.data.error });
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
        {isAuth() && token ? (
          <button
            disabled={!token}
            className="btn btn-outline-primary float-right"
          >
            {isAuth() || token ? 'Submit' : 'Login to post'}
          </button>
        ) : (
          <div class="alert alert-danger" role="alert">
            You will need to login to post a tutorial
          </div>
        )}
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row mb-3">
        <div className="col-md-12">
          <h1>Submit a Tutorial Link/URL</h1>
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
              <CategoryFormBlock
                categories={categories}
                loadedCategories={loadedCategories}
                onClick={handleCategoryToggle}
              />
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

Create.getInitialProps = ({ req }) => {
  const token = getCookie('token', req);
  return { token };
};

export default Create;
