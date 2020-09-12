import Link from 'next/link';

import Layout from '../../components/Layout';
import withAdmin from '../withAdmin';

const Admin = ({ user, token }) => {
  return (
    <Layout>
      <h1>Admin Dashboard</h1>
      <br />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item move-up">
              <a href="/admin/category/create" className="nav-link">
                Create Category
              </a>
            </li>
            <li className="nav-item move-up">
              <Link href="/admin/category/read">
                <a className="nav-link">All Categories</a>
              </Link>
            </li>
            <li className="nav-item move-up">
              <Link href="/admin/link/read">
                <a className="nav-link">All Tutorials/Courses</a>
              </Link>
            </li>
            <li className="nav-item move-up">
              <Link href="/user/profile/update">
                <a className="nav-link">Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8"></div>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
