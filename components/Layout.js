import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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
        <li className="nav-item">
          <Link href="/">
            <a className="nav-link text-dark">Home</a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/login">
            <a className="nav-link text-dark">
              <span className="fa fa-sign-in"></span> Log In
            </a>
          </Link>
        </li>
        <li className="nav-item">
          <Link href="/register">
            <a className="nav-link text-dark ">
              <span className="fa fa-user"></span> Register
            </a>
          </Link>
        </li>
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
