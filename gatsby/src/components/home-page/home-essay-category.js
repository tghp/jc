import React from 'react';
import { Link } from 'gatsby';
import { categoryPageSlug } from '../../model/post';

import Series from './series';
import Essay from './essay';

const HomeEssayCategory = ({ title, slug, posts: essays }) => {
  const essaysBySeries = {};

  essays.forEach((essay, index) => {
    let slug, type;
    const slugName = essay.tghpTaxonomySeries.nodes[0]?.slug;

    if (slugName) {
      slug = `series-${slugName}`;
      type = `series`;
    } else {
      slug = `post-${essay.slug}`;
      type = `post`;
    }

    if (essaysBySeries[slug] === undefined) {
      essaysBySeries[slug] = {
        type,
        slug,
        position: index,
      };
      essaysBySeries[slug].data = [];
    }

    essaysBySeries[slug].data.push(essay);
  });

  const sortedEssaysBySeries = Object.values(essaysBySeries).sort(
    (postA, postB) => postA.position - postB.position,
  );

  const maxSlots = 3;
  let slotsUsed = 0;

  return (
    <div className="essay-categories__category">
      <h2 className="essay-categories__category-title">
        <Link to={`${categoryPageSlug}/${slug}`}>{title}</Link>
      </h2>
      {sortedEssaysBySeries.map(({ type, data, slug }) => {
        if (slotsUsed > maxSlots) {
          return null;
        }

        if (data.length <= 2) {
          slotsUsed = slotsUsed + 1;
        } else if (data.length > 2 && data.length <= 6) {
          slotsUsed = slotsUsed + 2;
        } else if (data.length > 6) {
          slotsUsed = slotsUsed + 3;
        }

        return (
          <div
            className="essay-categories__category-essays category-essays"
            key={slug}
          >
            {type === 'series' && (
              <Series
                title={data[0].tghpTaxonomySeries.nodes[0]?.name}
                description={data[0].tghpTaxonomySeries.nodes[0]?.description}
                posts={data}
              />
            )}
            {type === 'post' && <Essay post={data[0]} />}
          </div>
        );
      })}
      <Link
        to={`${categoryPageSlug}/${slug}`}
        className="essay-categories__category-link"
      >
        View all {title} essays
      </Link>
    </div>
  );
};

export default HomeEssayCategory;
