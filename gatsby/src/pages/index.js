import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout';
import HomeContent from '../components/home-page/home-content';

import '../styles/home.scss';

const IndexPage = (
    {
        data: {
            homeMeta,
            latestPosts: { nodes: latestPosts },
            featuredPosts: { nodes: featuredPosts }
        }
    }
    ) => {

    return (
        <Layout location={'home'}>
            <HomeContent
                homeMeta={homeMeta}
                latestPosts={latestPosts}
                featuredPosts={featuredPosts}
            />
        </Layout>
    );
}

export const indexQuery = graphql`
{
    homeMeta: wpPage(isFrontPage: {eq: true}) {
        tghpjcIntroColumn1
        tghpjcIntroColumn2
        tghpjcIntroPhoto {
            alt
        }
        introPhoto {
            publicURL
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
    }   
  
    latestPosts: allWpPost(
        sort: {fields: [date], order: DESC}, 
        limit: 6
    ) {
        nodes {
            title
            slug
            date
            excerpt
            tghpjcPostSeriesPartNumber
            tghpTaxonomySeries {
                nodes {
                    name
                }
            }
        }
    }
    
    featuredPosts: allWpPost(
        sort: {fields: [date]},
        limit: 6,
        filter: {tghpjcFeaturedEssay: {eq: "1"}}
    ) {
        nodes {
            title
            slug
            date
            excerpt
            tghpjcPostSeriesPartNumber
            tghpTaxonomySeries {
                nodes {
                    name
                }
            }
        }
    }
    
}
`

export default IndexPage