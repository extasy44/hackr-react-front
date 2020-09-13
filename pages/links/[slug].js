import { useState, useEffect, Fragment } from 'react';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';
import Link from 'next/link';
import renderHTML from 'react-render-html';

import InfiniteScroll from 'react-infinite-scroller';
import Layout from '../../components/Layout';
import PlaceHolder from '../../components/PlaceHolder';
import { API, APP_NAME } from '../../config';
import { isAuth } from '../../helpers/auth';

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linkSkip);
  const [size, setSize] = useState(totalLinks);
  const [filters, setFilters] = useState();
  const [checkFilter, setCheckFilter] = useState({
    type: [],
    medium: [],
    level: []
  });
  const [subscribed, setSubscribed] = useState(false);

  const head = () => (
    <Head>
      <title>
        {category.name} | {APP_NAME}
      </title>
      <meta name="description" content={category.content} />
    </Head>
  );

  const [popularLinks, setPopularLinks] = useState([]);
  useEffect(() => {
    loadPopularLinks();
    checkSubscribed();
  }, []);

  const checkSubscribed = () => {
    if (isAuth()) {
      const subscribe = isAuth().categories?.indexOf(category._id);
      if (subscribe !== -1) {
        setSubscribed(true);
      }
    }
  };

  const loadPopularLinks = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);

    setPopularLinks(response.data);
  };

  useEffect(() => {
    const filterOptions = {
      type: [],
      medium: [],
      level: []
    };

    if (allLinks) {
      allLinks.map((link) => {
        const type = filterOptions.type.indexOf(link.type);
        const medium = filterOptions.medium.indexOf(link.medium);
        const level = filterOptions.level.indexOf(link.level);

        if (type === -1) {
          filterOptions.type.push(link.type);
        }

        if (medium === -1) {
          filterOptions.medium.push(link.medium);
        }

        if (level === -1) {
          filterOptions.level.push(link.level);
        }
      });
      setFilters(filterOptions);
    }
  }, [allLinks]);

  const fetchLinks = async () => {
    const response = await axios.post(`${API}/filter-links`, {
      skip,
      limit,
      checkFilter,
      categoryId: category._id
    });
    setAllLinks(response.data);
  };

  const handleFilterToggle = (name) => (e) => {
    const clickedFilter = checkFilter[name].indexOf(e.target.value);
    const all = checkFilter;

    if (clickedFilter === -1) {
      all[name].push(e.target.value);
    } else {
      all[name].splice(clickedFilter, 1);
    }

    setCheckFilter(all);
    fetchLinks();
  };

  const showFilters = () => {
    if (filters) {
      return (
        allLinks.length > 0 && (
          <div className="row alert alert-info p-2 ml-1 mr-1">
            <div className="filters col-md-12" style={{ fontSize: '0.9rem' }}>
              <h6>Filter Courses : </h6>
              <span className="link-filter ml-2">
                Type :{' '}
                {filters.type.map((value) => (
                  <span className="m-1" key={value}>
                    <input
                      type="checkbox"
                      name="type"
                      value={value}
                      onChange={handleFilterToggle('type')}
                      className="mr-2"
                      checked={checkFilter.type.includes(value)}
                    />
                    <label className="form-check-label text-muted">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  </span>
                ))}
              </span>
              <span className="link-filter ml-2">
                Medium :{' '}
                {filters.medium.map((value) => (
                  <span className="m-1" key={value}>
                    <input
                      type="checkbox"
                      name="medium"
                      onChange={handleFilterToggle('medium')}
                      value={value}
                      className="mr-2"
                      checked={checkFilter.medium.includes(value)}
                    />
                    <label className="form-check-label text-muted">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  </span>
                ))}
              </span>
              <span className="link-filter ml-2">
                Level :{' '}
                {filters.level.map((value) => (
                  <span className="m-1" key={value}>
                    <input
                      type="checkbox"
                      name="level"
                      onChange={handleFilterToggle('level')}
                      value={value}
                      className="mr-2"
                      checked={checkFilter.level.includes(value)}
                    />
                    <label className="form-check-label text-muted">
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </label>
                  </span>
                ))}
              </span>
            </div>
          </div>
        )
      );
    }
  };

  const renderLinks = () => {
    return (
      allLinks &&
      allLinks.map((link, i) => (
        <div
          className="row alert alert-light p-2 ml-1 mr-1"
          style={{ border: '1px solid #e3e3e3' }}
          key={i}
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
              <button
                className="btn btn-primary mr-2 p-1"
                style={{ fontSize: '0.7rem' }}
                value={link.type}
                onClick={handleFilterToggle('type')}
              >
                {link.type}
              </button>
              <button
                className="btn btn-primary mr-2 p-1"
                style={{ fontSize: '0.7rem' }}
                value={link.medium}
                onClick={handleFilterToggle('medium')}
              >
                {link.medium}
              </button>
              <button
                className="btn btn-primary mr-2 p-1"
                style={{ fontSize: '0.7rem' }}
                value={link.level}
                onClick={handleFilterToggle('level')}
              >
                {link.level}
              </button>
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
      ))
    );
  };

  const renderPopularLinks = () => {
    return (
      popularLinks &&
      popularLinks.map((link) => (
        <li className="d-flex p-2">
          <div>
            <a
              href={link.url}
              target="_blank"
              onClick={(e) => handleClick(link._id)}
            >
              <div style={{ fontSize: '1rem' }}>{link.title}</div>
            </a>
            <div className="text-muted" style={{ fontSize: '0.6rem' }}>
              {moment(link.createdAt).fromNow()} by {link.postedBy.name}
            </div>
          </div>
        </li>
      ))
    );
  };

  const loadMore = async () => {
    let toSkip = skip + limit;

    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit
    });

    setSize(response.data.links.length);
    setAllLinks([...allLinks, ...response.data.links]);
    setSkip(toSkip);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  return (
    <Fragment>
      {head()}
      <Layout>
        <div className="row">
          <div className="col-md-12">
            <div style={{ flex: 1 }}>
              <h1 className="medium" style={{ fontSize: '1.8rem' }}>
                <img
                  src={category.image.url}
                  alt={category.name}
                  style={{ width: 'auto', maxHeight: '50px' }}
                />
                {'   '}
                {category.name} Tutorials and Courses
                {subscribed && (
                  <span
                    class="badge badge-success ml-2 p-1"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Subscribed
                  </span>
                )}
              </h1>
            </div>
            <div className="text-muted mt-3">
              {renderHTML(category.content || '')}
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-2">
            <h6>Popular in {category.name}</h6>
            <ul className="list-unstyled mb-3">{renderPopularLinks()}</ul>
          </div>
          <div className="col-md-10">
            {allLinks.length == 0 && (
              <div className="alert alert-warning">
                No tutorials submitted yet.
              </div>
            )}
            {filters && showFilters()}
            {renderLinks()}
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
    </Fragment>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 10;

  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit
  });

  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip
  };
};

export default Links;
