import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alert';

import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Create = ({ user, token }) => {
  const [state, setState] = useState({
    error: '',
    success: '',
    categories: []
  });

  const { error, success, categories } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await axios.get(`${API}/category`);
    setState({ ...state, categories: response.data });
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let confirm = window.confirm('Are you sure, you want to delete?');

    if (confirm) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      loadCategories();
      console.log('Category delete response : ', response);
    } catch (error) {}
  };

  const listCategories = () =>
    categories.map((c) => (
      <div className="p-2 col-md-6" key={c._id}>
        <div
          style={{
            border: '1px solid #eeeeee',
            borderRadius: '10px'
          }}
          className="row p-2"
          style={{ alignItems: 'center', color: 'black', position: 'relative' }}
        >
          <div className="ml-4">
            <img
              src={c.image && c.image.url}
              alt={c.name}
              style={{ width: '55px', height: '55px' }}
              className="rounded"
            />
          </div>
          <div className="ml-4 mr-4">{c.name}</div>
          <div style={{ position: 'absolute', right: '20px' }}>
            <Link href={`/admin/category/${c.slug}`}>
              <a
                className="btn btn-outline-primary m-1"
                style={{ fontSize: '0.9rem' }}
              >
                Edit
              </a>
            </Link>

            <span
              className="btn btn-outline-danger m-1"
              style={{ fontSize: '0.9rem' }}
              onClick={(e) => confirmDelete(e, c.slug)}
            >
              Delete
            </span>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col">
          <h1>Categories</h1>
          <br />
        </div>
      </div>
      <div className="row"> {listCategories()} </div>
    </Layout>
  );
};

export default withAdmin(Create);
