import React from 'react';
import TocItem from './table-of-contents-item';
import { groupHeadings } from '../../model/toc';

const TocNav = ({ navItems }) => {
  if (navItems) {
    navItems = groupHeadings(0, [], navItems);
  }

  return (
    <ul className="single-essay__sidebar-menu-nav">
      {navItems?.map(({ url, title, items: navItems }) => (
        <TocItem key={url} url={url} title={title} navItems={navItems} />
      ))}
    </ul>
  );
};

export default TocNav;
