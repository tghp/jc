import React from 'react'
import { graphql } from 'gatsby'
import { MetaData } from "../components/meta-data";
import Layout from '../components/layout';
import HomeContent from '../components/home-page/home-content';

import '../styles/home.scss';

const IndexPage = ({
        data: {
            homeMeta,
            allPosts: { nodes: allPosts },
            wp: {
                siteOptionsMetaboxSettings: {
                    optionsFavouritesPosts: favouritePostIds
                }
            },
        }
    }) => {

    return (
        <>
            <MetaData title={`Home`} />
            <Layout location={'home'}>
                <HomeContent
                    homeMeta={homeMeta}
                    allPosts={allPosts}
                    favouritePostIds={favouritePostIds}
                />
            </Layout>
        </>
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
  
    allPosts: allWpPost(
        sort: {fields: [date], 
        order: DESC}
    ) {
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
`

export default IndexPage