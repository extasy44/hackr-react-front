import React from 'react';
import ContentLoader from 'react-content-loader';

const PlaceHolder = (props) => (
  <ContentLoader
    speed={1}
    width={600}
    height={220}
    viewBox="0 0 800 160"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="48" y="8" rx="3" ry="3" width="140" height="6" />
    <rect x="48" y="26" rx="3" ry="3" width="80" height="6" />
    <rect x="0" y="56" rx="3" ry="3" width="550" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="480" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="378" height="6" />
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
);

export default PlaceHolder;
