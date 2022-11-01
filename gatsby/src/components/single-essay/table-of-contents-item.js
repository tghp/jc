import React from 'react';
import { decode } from 'html-entities';

const TocItem = ({ url, title, navItems }) => (
  <li>
    <a href={url}>
      {title} <i className="arrow-right" />
    </a>
    {navItems && (
      <ul className="subnav">
        {navItems?.map(({ url, title, items }) => (
          <li key={url}>
            <a href={url}>
              {title} <i className="arrow-right" />
            </a>
            {items && (
              <ul className="subnav">
                {items?.map(({ url, title }) => (
                  <li key={url}>
                    <a href={url}>
                      <span>{decode(title, { level: 'html5' })}</span>{' '}
                      <i className="arrow-right" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default TocItem;
