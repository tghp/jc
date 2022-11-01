import React from 'react';
import { getPostDate, getPostPath } from '../../model/post';
import EssayLinkWrapper from '../essay-link-wrapper';

const Series = ({ title, description, posts }) => (
  <div className="category-essays__series">
    <div className="category-essays__series-title">[Series] {title}</div>
    {description && (
      <div
        className="category-essays__series-excerpt"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    )}
    <div className="category-essays__series-date">
      {getPostDate(posts[0].date)}
    </div>
    <div className="category-essays__series-essays">
      {posts
        .sort(
          (postA, postB) =>
            Number(postA.tghpjcPostSeriesPartNumber) -
            Number(postB.tghpjcPostSeriesPartNumber),
        )
        .map(
          ({
            slug,
            title,
            date,
            tghpjcPostSeriesPartNumber: partNumber,
            tghpjcExternalUrl: externalUrl,
          }) => {
            const essayOutput = (
              <div className="category-essays__series-essay-title">
                {partNumber && `Part ${partNumber}: `}
                {title}
              </div>
            );

            return (
              <EssayLinkWrapper
                externalUrl={externalUrl}
                className={`category-essays__series-essay`}
                postPath={getPostPath(slug, date)}
                key={slug}
              >
                {essayOutput}
              </EssayLinkWrapper>
            );
          },
        )}
    </div>
  </div>
);

export default Series;
