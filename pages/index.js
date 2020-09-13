import { useEffect, useState, Fragment } from 'react';
import moment from 'moment';
import Head from 'next/head';
import Layout from '../components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { API, APP_NAME } from '../config';

const Home = ({ categories }) => {
  const head = () => (
    <Head>
      <title>Find online Programming courses and Tutorials {APP_NAME}</title>
      <meta
        name="description"
        content="Programming courses/tutorials, we tell you which is the best one. Find the best online courses &amp; tutorials recommended by the Programming community. Pick the most upvoted tutorials as per your learning style: video-based, book, free, paid, for beginners, advanced, etc."
      />
    </Head>
  );

  const [popularLinks, setPopularLinks] = useState([]);
  useEffect(() => {
    loadPopularLinks();
  }, []);

  const loadPopularLinks = async () => {
    const response = await axios.get(`${API}/link/popular`);

    setPopularLinks(response.data);
  };

  const listCategories = () =>
    categories.map((c) => (
      <Link href={`/links/${c.slug}`} key={c._id}>
        <a className="p-2 col-md-4">
          <div
            style={{
              border: '1px solid #eeeeee',
              borderRadius: '10px'
            }}
            className="p-2 move-up shadow"
          >
            <div
              className="row"
              style={{ alignItems: 'center', color: 'black' }}
            >
              <div className="ml-4 mr-4">
                <img
                  src={c.image && c.image.url}
                  alt={c.name}
                  style={{ width: '55px', height: '55px' }}
                  className="rounded"
                />
              </div>
              {c.name}
            </div>
          </div>
        </a>
      </Link>
    ));

  const listPopularLinks = () =>
    popularLinks.map((link, i) => (
      <div
        className="row alert alert-light p-2 ml-1 mr-1"
        style={{ border: '1px solid #e3e3e3' }}
        key={i}
      >
        <div className="col-md-10">
          <a href={link.url} target="_blank">
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
              value={link.type}
            >
              {link.type}
            </span>
            <span
              className="badge badge-info mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
              value={link.medium}
            >
              {link.medium}
            </span>
            <span
              className="badge badge-info mr-2 p-1"
              style={{ fontSize: '0.7rem' }}
              value={link.level}
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
          <span className="badge text-secondary pull-right">
            {link.clicks} clicks
          </span>
        </div>
      </div>
    ));

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="font-weight-bold">
              Find Programming Courses & Tutorials
            </h1>
            <br />
            <br />
          </div>
        </div>

        <div className="row">{listCategories()}</div>
        <div className="row mt-3">
          <div className="col-md-12 mt-2">
            {' '}
            <h4 className="font-weight-bold mb-4">Popular Links</h4>
            {listPopularLinks()}
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/category`);

  return {
    categories: response.data
  };
};

export default Home;
