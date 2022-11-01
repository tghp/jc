import React from 'react';
import { Link } from 'gatsby';

const EssayLinkWrapper = ({ externalUrl, className, postPath, children }) => {
  if (externalUrl) {
    return (
      <a href={externalUrl} className={className} target={`_blank`}>
        {children}
      </a>
    );
  } else {
    return (
      <Link to={postPath} className={className}>
        {children}
      </Link>
    );
  }
};

export default EssayLinkWrapper;
