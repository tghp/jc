import React from 'react';
import { getPostPath, getPostDate } from '../model/post';
import LinkArrow from '../assets/link-arrow.svg';
import EssayLinkWrapper from './essay-link-wrapper';

const EssayLink = ({
  post: {
    slug,
    date,
    title,
    excerpt,
    tghpTaxonomySeries,
    tghpjcPostSeriesPartNumber: seriesPart,
    tghpjcExternalUrl: externalUrl,
  },
}) => {
  const seriesTitle = tghpTaxonomySeries?.nodes[0]?.name;

  const essayOutput = (
    <>
      <div className="post-essays__essay-date">{getPostDate(date)}</div>
      <div className="post-essays__essay-title">
        <div className="post-essays__essay-title-series">
          {seriesTitle && `${seriesTitle} / Part ${seriesPart}: `}
        </div>
        {title}
      </div>
      {excerpt && (
        <div
          className="post-essays__essay-excerpt"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      )}
      <div className="post-essays__essay-action">
        Continue reading <LinkArrow />
      </div>
    </>
  );

  return (
    <EssayLinkWrapper
      externalUrl={externalUrl}
      className={`post-essays__essay`}
      postPath={getPostPath(slug, date)}
    >
      {essayOutput}
    </EssayLinkWrapper>
  );
};

export default EssayLink;
