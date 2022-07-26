import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout';
import HomeFeaturedEssays from "../components/home-featured-essays";
import HomeEssayCategories from "../components/home-essay-categories";

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
        <Layout>
            <div className="intro-text">
                <div className="intro-text__inner">
                    <div className="intro-text__column-1" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcIntroColumn1}} />
                    <div className="intro-text__column-2" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcIntroColumn2}} />
                    <div className="intro-text__photo">
                        <img src={homeMeta.tghpjcIntroPhoto.url}
                             srcSet={homeMeta.tghpjcIntroPhoto.srcset}
                             sizes="200px"
                             alt={homeMeta.tghpjcIntroPhoto.alt} />
                    </div>
                </div>
            </div>
            <div className="featured-essays">
                <div className="featured-essays__inner">
                    <HomeFeaturedEssays title="Latest" posts={latestPosts} titleLink={true} />
                    <HomeFeaturedEssays title="Featured" posts={featuredPosts} titleLink={false} />
                </div>
            </div>
            <div className="essay-categories">
                <div className="essay-categories__inner">
                    <HomeEssayCategories selectedCategories={homeMeta.tghpjcHomeEssayCategories} />
                </div>
            </div>
            <div className="about-text">
                <div className="about-text__inner">
                    <div className="about-text__title">
                        <h2>{homeMeta.tghpjcAboutTextTitle}</h2>
                    </div>
                    <div className="about-text__column-1" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcAboutTextColumn1}} />
                    <div className="about-text__column-2" dangerouslySetInnerHTML={{ __html: homeMeta.tghpjcAboutTextColumn2}} />
                </div>
            </div>
        </Layout>
    );
}

export const indexQuery = graphql`
{
    homeMeta: wpPage(isFrontPage: {eq: true}) {
        tghpjcIntroColumn1
        tghpjcIntroColumn2
        tghpjcIntroPhoto {
            id
            alt
            url
            srcset
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
  
    latestPosts: allWpPost(sort: {fields: [date]}, limit: 6) {
        nodes {
            title
            slug
            date
            excerpt
        }
    }
    
    featuredPosts: allWpPost(
        sort: {fields: [date]}
        limit: 6
        filter: {tghpjcFeaturedEssay: {eq: "1"}}
    ) {
        nodes {
            title
            slug
            date
            excerpt
        }
    }
    
}
`

export default IndexPage