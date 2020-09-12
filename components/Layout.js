import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { isAuth, logout } from '../helpers/auth';

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const head = () => (
    <React.Fragment>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:400,700"
      />
      <link rel="stylesheet" href="/static/css/styles.css" />
    </React.Fragment>
  );

  const nav = () => (
    <div className="nav-container">
      <ul className="nav nav-tabs">
        <li>
          <Link href="/">
            <a>
              <i
                className="fa fa-code text-primary ml-2 mt-1"
                style={{ fontSize: '2rem', fontWeight: 'bold' }}
              />
            </a>
          </Link>
        </li>
        <li className="nav-item ml-auto">
          <Link href="/user/link/create">
            <a
              className="nav-link btn btn-outline-primary"
              style={{ borderRadius: '0px' }}
            >
              <i className="fa fa-plus-square"></i>{' '}
              <span className="nav-content">Submit a course</span>
            </a>
          </Link>
        </li>

        {!isAuth() && (
          <React.Fragment>
            <li className="nav-item">
              <Link href="/login">
                <a className="nav-link text-dark">
                  <i className="fa fa-sign-in" />{' '}
                  <span className="nav-content">Login</span>
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/register">
                <a className="nav-link text-dark ">
                  <i className="fa fa-user" />{' '}
                  <span className="nav-content">Register</span>
                </a>
              </Link>
            </li>
          </React.Fragment>
        )}

        {isAuth() && isAuth().role === 'admin' && (
          <li className="nav-item">
            <Link href="/admin">
              <a className="nav-link text-dark ">
                <i className="fa fa-id-card" />{' '}
                <span className="nav-content">Admin</span>
              </a>
            </Link>
          </li>
        )}

        {isAuth() && (
          <li className="nav-item">
            <Link href="/user">
              <a className="nav-link text-dark ">
                <i className="fa fa-user" />{' '}
                <span className="nav-content">{isAuth().name}</span>
              </a>
            </Link>
          </li>
        )}

        {isAuth() && (
          <li className="nav-item">
            <a href="#" className="nav-link text-dark" onClick={logout}>
              <i className="fa fa-sign-out"></i>{' '}
              <span className="nav-content">Logout</span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );

  return (
    <React.Fragment>
      {head()} {nav()}
      <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
