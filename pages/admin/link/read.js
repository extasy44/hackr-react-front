import { useState } from 'react';
import Layout from '../../../components/Layout';
import PlaceHolder from '../../../components/PlaceHolder';
import axios from 'axios';
import Router from 'next/router';
import moment from 'moment';
import Link from 'next/link';
import { API } from '../../../config';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Links = ({ links, totalLinks, linksLimit, linkSkip, token }) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);

  const confirmDelete = (e, id) => {
    e.preventDefault();
    let confirm = window.confirm('Are you sure, you want to delete?');

    if (confirm) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = axios.delete(`${API}/link/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      Router.replace('/admin/link/read');
    } catch (error) {
      console.log(error);
    }
  };

  const listOfLinks = () =>
    allLinks.map((link, i) => (
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
              className="btn btn-primary mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {link.type}
            </span>
            <span
              className="btn btn-primary mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
            >
              {link.medium}
            </span>
            <span className="mr-2 p-1" style={{ fontSize: '1rem' }}>
              {link.categories.map((category, i) => (
                <span key={i} className="badge text-success">
                  <Link
                    href={`/links/${category.slug}`}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title={`link to ${category.name} page`}
                  >
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

  const loadMore = async () => {
    const toSkip = skip + limit;

    const response = await axios.post(
      `${API}/links`,
      {
        skip: toSkip,
        limit
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setAllLinks([...allLinks, ...response.data]);
    setSize(response.data.length);
    setSkip(toSkip);
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1 className="medium" style={{ fontSize: '1.8rem' }}>
            All Tutorials and Courses
          </h1>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          {allLinks.length == 0 && (
            <div className="alert alert-warning">
              No tutorials submitted yet.
            </div>
          )}
          {listOfLinks()}
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={size > 0 && size >= limit}
            loader={<PlaceHolder key="place-holder" className="pl-5" />}
            useWindow={false}
            children={''}
          ></InfiniteScroll>
        </div>
      </div>
    </Layout>
  );
};

Links.getInitialProps = async ({ req }) => {
  let skip = 0;
  let limit = 10;

  const token = getCookie('token', req);
  const response = await axios.post(
    `${API}/links`,
    {
      skip,
      limit
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    links: response.data,
    totalLinks: response.data.length,
    linksLimit: limit,
    linkSkip: skip
  };
};

export default withAdmin(Links);
