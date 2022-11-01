import React from 'react';
import { Link } from 'gatsby';
import LinkArrow from '../assets/link-arrow.svg';

const HeadingWithLink = ({ title, linkText, linkTo, linkArrow }) => (
  <div className="heading-with-link">
    <div className="heading-with-link__title">{title}</div>
    <Link to={linkTo} className="heading-with-link__link">
      {linkText} {linkArrow && <LinkArrow />}
    </Link>
  </div>
);

export default HeadingWithLink;
