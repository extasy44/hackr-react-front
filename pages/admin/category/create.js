import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';

import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Create = ({ token }) => {
  const [state, setState] = useState({
    name: '',
    error: '',
    success: '',
    buttonText: 'Create',
    image: ''
  });

  const [content, setContent] = useState('');

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    'Upload image'
  );

  const { name, error, success, image, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: '',
      success: ''
    });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: '', error: '' });
    console.log(e);
  };

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        'JPEG',
        100,
        0,
        (uri) => {
          // console.log(uri);
          setState({ ...state, image: uri, success: '', error: '' });
        },
        'base64'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: 'Creating' });

    try {
      const response = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('CATEGORY CREATE RESPONSE : ', response);
      setImageUploadButtonName('Upload Image');
      setContent('');
      setState({
        ...state,
        name: '',
        buttonText: 'Create',
        success: `${response.data.name} has been created`
      });
    } catch (error) {
      console.log('CATEGORY CREATE ERROR : ', error);
      setState({
        ...state,
        buttonText: 'Create',
        error: error.response.data.error
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          value={name}
          onChange={handleChange('name')}
          type="text"
          className="form-control"
          placeholder="category title"
          required
        />
      </div>

      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={handleImage}
            type="file"
            theme="snow"
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>

      <div className="form-group">
        <label className="text-muted">Content</label>

        <ReactQuill
          value={content}
          onChange={handleContent}
          placholder="Categroy description"
          className="mb-5"
          style={{ height: '24vh' }}
        />
      </div>

      <div className="form-group">
        <button className="btn btn-outline-dark float-right">
          {' '}
          {buttonText}{' '}
        </button>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="row">
        <div className="col-md-9 offset-md-1">
          <h1> Create Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withAdmin(Create);
