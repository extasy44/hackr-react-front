import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

import Resizer from 'react-image-file-resizer';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';

import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Update = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: '',
    success: '',
    buttonText: 'Update',
    imagePreview: oldCategory.image.url,
    image: ''
  });

  const [content, setContent] = useState(oldCategory.content);

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    'Update image'
  );

  const { name, error, success, image, buttonText, imagePreview } = state;

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
    setState({ ...state, buttonText: 'Updating' });

    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('CATEGORY UPDATE RESPONSE : ', response);
      setImageUploadButtonName('Update Image');
      setContent(response.data.content);
      setState({
        ...state,
        name: response.data.name,
        buttonText: 'Update',
        imagePreview: response.data.image.url,
        success: `${response.data.name} has been updated`
      });
    } catch (error) {
      console.log('CATEGORY UPDATE ERROR : ', error);
      setState({
        ...state,
        buttonText: 'Update',
        error: error.response.data.error
      });
    }
  };

  const updateCategoryForm = () => (
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
        <span className="ml-2">
          <img src={imagePreview} alt={name} height="30px" />
        </span>
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
        <Link href="/admin/category/read">
          <a className="btn btn-outline-dark">Cancel</a>
        </Link>

        <button className="btn btn-outline-primary float-right">
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
          <h1> Update Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {updateCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

Update.getInitialProps = async ({ req, query, token }) => {
  const response = await axios.post(`${API}/category/${query.slug}`);

  return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);
