import Layout from '../../components/Layout';
import Link from 'next/link';
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import { API } from '../../config';
import { getCookie } from '../../helpers/auth';
import withUser from '../withUser';

const User = ({ user, token, userLinks }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
    let confirm = window.confirm('Are you sure, you want to delete?');

    if (confirm) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      Router.replace('/user');
    } catch (error) {}
  };

  const renderLinks = () => {
    return userLinks.map((link) => (
      <div
        className="row alert alert-light p-2 ml-1 mr-1"
        style={{ border: '1px solid #e3e3e3' }}
        key={link._id}
      >
        <div className="col-md-10">
          <a
            href={link.url}
            target="_blank"
            onClick={(e) => handleClick(link._id)}
          >
            <div style={{ fontSize: '1.2rem' }} className="text-dark">
              {link.title}
            </div>
          </a>
          <div style={{ fontSize: '0.8rem' }}>
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </div>
          <div className="mt-1">
            <span
              className="badge badge-info mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {link.type}
            </span>
            <span
              className="badge badge-info mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {link.medium}
            </span>
            <span
              className="badge badge-info mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {link.level}
            </span>
            <span className="mr-2 p-1" style={{ fontSize: '1rem' }}>
              {link.categories.map((category, i) => (
                <span key={i} className="badge text-success">
                  <Link href={`/links/${category.slug}`}>
                    <a>{category.name}</a>
                  </Link>
                </span>
              ))}
            </span>
          </div>
        </div>
        <div className="col-md-2 pt-2">
          <Link href={`/user/link/${link._id}`}>
            <a>
              <span
                className="btn btn-outline-primary pull-right"
                style={{ padding: '2px', margin: '2px', width: '80px' }}
              >
                Update
              </span>
            </a>
          </Link>

          <span
            className="btn btn-outline-danger pull-right"
            style={{ padding: '2px', margin: '2px', width: '80px' }}
            onClick={(e) => confirmDelete(e, link._id)}
          >
            Delete
          </span>
        </div>
      </div>
    ));
  };

  return (
    <Layout>
      <div className="row">
        <div className="p-2 col-md-6">
          <div style={{ fontSize: '1.4rem' }} className="text-dark">
            {user.name}'s Profile{' '}
            <Link href="/user/profile/update">
              <a>
                <span
                  className="btn btn-outline-primary ml-2"
                  style={{ fontSize: '0.8rem', padding: '2px', width: '50px' }}
                >
                  Edit
                </span>
              </a>
            </Link>
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Joined {moment(user.createdAt).fromNow()}
          </div>
        </div>
      </div>
      <br />
      <div className="card card-body">
        <div className="active"> Submitted </div>
        <hr />
        {userLinks.length == 0 ? (
          <div
            className="col-md-4 d-flex justify-content-center"
            style={{
              margin: ' 0 auto'
            }}
          >
            <img
              src="static/images/submit-tutorials.svg"
              with="120px"
              height="120px"
              style={{
                opacity: '0.6'
              }}
            />
            <div className="mt-3 text-muted">
              You don't have any submissions! Remember, sharing is caring
            </div>
          </div>
        ) : (
          renderLinks()
        )}
      </div>
    </Layout>
  );
};

export default withUser(User);
