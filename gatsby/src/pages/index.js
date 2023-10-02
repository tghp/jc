import React from 'react';
import { graphql } from 'gatsby';
import { HeadMeta } from '../components/meta-data-head';
import Layout from '../components/layout';
import HomeContent from '../components/home-page/home-content';

import '../styles/home.scss';

const IndexPage = ({
  data: {
    homeMeta,
    allPosts: { nodes: allPosts },
    wp: {
      siteOptionsMetaboxSettings: { optionsFavouritesPosts: favouritePostIds },
    },
  },
}) => {
  return (
    <Layout location={'home'} seoData={homeMeta.seo}>
      <HomeContent
        homeMeta={homeMeta}
        allPosts={allPosts}
        favouritePostIds={favouritePostIds}
      />
    </Layout>
  );
};

export const indexQuery = graphql`
  {
    homeMeta: wpPage(isFrontPage: { eq: true }) {
      tghpjcIntroColumn1
      tghpjcIntroColumn2
      tghpjcIntroPhoto {
          nodes {
              gatsbyImage(layout: FULL_WIDTH, width: 400, placeholder: NONE, quality: 90)
              altText
          }
      }
      tghpjcHomeEssayCategories {
        id
        name
        taxonomy
        slug
      }
      tghpjcAboutTextTitle
      tghpjcAboutTextColumn1
      tghpjcAboutTextColumn2
      ...SeoData
    }

    allPosts: allWpPost(sort: { fields: [date], order: DESC }) {
      nodes {
        title
        slug
        date
        excerpt
        tghpjcPostSeriesPartNumber
        tghpjcExternalUrl
        tghpTaxonomySeries {
          nodes {
            name
            slug
            description
          }
        }
        databaseId
      }
    }

    wp {
      siteOptionsMetaboxSettings {
        optionsFavouritesPosts
      }
    }
  }
`;

export default IndexPage;

export const Head = () => <HeadMeta />;
