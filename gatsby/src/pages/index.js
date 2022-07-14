import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout';
import HomeLatestEssays from "../components/home-latest-essays";
import HomeFeaturedEssays from "../components/home-featured-essays";
import HomeEssayCategory from "../components/home-essay-category";

const IndexPage = (
    {
        data: {
            homePage: { introText },
            latestPosts: { posts: latestPosts },
            featuredPosts: { posts: featuredPosts },
            termEthics: { name: ethicsTermTitle},
            postsEthics: { posts: ethicsPosts},
            termRationality: { name: rationalityTermTitle},
            postsRationality: { posts: rationalityPosts},
            termMetaEthics: { name: metaEthicsTermTitle },
            postsMetaEthics: { posts: metaEthicsPosts }
        }
    }
    ) => (
    <Layout>
        <div className="intro-text">
            <div className="intro-text__inner">
                <div className="intro-text__column-1" dangerouslySetInnerHTML={{ __html: introText[0].tghpjcIntroColumn1}} />
                <div className="intro-text__column-2" dangerouslySetInnerHTML={{ __html: introText[0].tghpjcIntroColumn2}} />
            </div>
        </div>
        <div className="featured-essays">
            <div className="featured-essays__inner">
                <HomeLatestEssays posts={latestPosts} />
                <HomeFeaturedEssays posts={featuredPosts} />
            </div>
        </div>
        <div className="essay-categories">
            <HomeEssayCategory title={ethicsTermTitle} posts={ethicsPosts} />
            <HomeEssayCategory title={rationalityTermTitle} posts={rationalityPosts} />
            <HomeEssayCategory title={metaEthicsTermTitle} posts={metaEthicsPosts} />
        </div>
    </Layout>
);

export const indexQuery = graphql`
{
    homePage: allWpPage(filter: {uri: {eq: "/"}}) {
        introText: nodes {
            tghpjcIntroColumn1
            tghpjcIntroColumn2
        }
    }
  
    latestPosts: allWpPost(sort: {fields: [date]}, limit: 6) {
        posts: nodes {
            id
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
        posts: nodes {
            id
            title
            slug
            date
            excerpt
        }
    }
  
    termEthics: wpTermNode(slug: {eq: "ethics"}) {
        name
    }
    postsEthics: allWpPost(
        sort: {fields: [date]}
        filter: {categories: {nodes: {elemMatch: {slug: {eq: "ethics"}}}}}
        limit: 3
    ) {
        posts: nodes {
            title
            excerpt
            slug
            date
        }
    }
    termRationality: wpTermNode(slug: {eq: "rationality"}) {
        name
    }
    postsRationality: allWpPost(
        sort: {fields: [date]}
        filter: {categories: {nodes: {elemMatch: {slug: {eq: "rationality"}}}}}
        limit: 3
    ) {
        posts: nodes {
            title
            excerpt
            slug
            date
        }
    }
    termMetaEthics: wpTermNode(slug: {eq: "meta-ethics"}) {
        name
    }
    postsMetaEthics: allWpPost(
        sort: {fields: [date]}
        filter: {categories: {nodes: {elemMatch: {slug: {eq: "meta-ethics"}}}}}
        limit: 3
    ) {
        posts: nodes {
            title
            excerpt
            slug
            date
        }
    }
}
`

export default IndexPage
