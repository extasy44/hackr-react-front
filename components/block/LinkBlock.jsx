import moment from 'moment';
import Link from 'next/link';

const LinkBlock = ({ link }) => (
  <div
    className="row alert alert-light p-2 ml-1 mr-1"
    style={{ border: '1px solid #e3e3e3' }}
  >
    <div className="col-md-10">
      <a href={link.url} target="_blank" onClick={(e) => handleClick(link._id)}>
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
);

export default LinkBlock;
