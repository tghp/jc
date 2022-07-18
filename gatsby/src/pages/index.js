import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout';
import HomeFeaturedEssays from "../components/home-featured-essays";
import HomeEssayCategory from "../components/home-essay-category";

const IndexPage = (
    {
        data: {
            homePageData,
            latestPosts: { posts: latestPosts },
            featuredPosts: { posts: featuredPosts },
            allWpCategory: { categories }
        }
    }
    ) => {

    const chosenCategories = [{slug: 'rationality'}, {slug: "uncategorized"}]
    const filteredCategories = categories.filter(category => chosenCategories.some(item => item.slug === category.slug))

    console.log(chosenCategories)
    console.log(categories)
    console.log(filteredCategories)
    console.log(homePageData.tghpjcIntroPhoto)
    console.log(homePageData.tghpjcHomeEssayCategories)

    return (
        <Layout>
            <div className="intro-text">
                <div className="intro-text__inner">
                    <div className="intro-text__column-1" dangerouslySetInnerHTML={{ __html: homePageData.tghpjcIntroColumn1}} />
                    <div className="intro-text__column-2" dangerouslySetInnerHTML={{ __html: homePageData.tghpjcIntroColumn2}} />
                    <div className="intro-text__photo">
                        <img src=""
                             srcSet=""
                             sizes="100vw, (min-width: 660px) 50vw, (min-width: 1440px) 33vw"
                             alt=""/>
                    </div>
                </div>
            </div>
            <div className="featured-essays">
                <div className="featured-essays__inner">
                    <HomeFeaturedEssays title="Latest" posts={latestPosts} />
                    <HomeFeaturedEssays title="Featured" posts={featuredPosts} />
                </div>
            </div>
            <div className="essay-categories">
                {categories.map(({ name, posts, slug }) => (
                    <HomeEssayCategory title={name} posts={posts} key={slug} />
                ))}
            </div>
            <div className="about-text">
                <div className="about-text__inner">
                    <div className="about-text__title">
                        <h2>{homePageData.tghpjcAboutTextTitle}</h2>
                    </div>
                    <div className="about-text__column-1" dangerouslySetInnerHTML={{ __html: homePageData.tghpjcAboutTextColumn1}} />
                    <div className="about-text__column-2" dangerouslySetInnerHTML={{ __html: homePageData.tghpjcAboutTextColumn2}} />
                </div>
            </div>
        </Layout>
    );
}

export const indexQuery = graphql`
{
    homePageData: wpPage(isFrontPage: {eq: true}) {
        tghpjcIntroColumn1
        tghpjcIntroColumn2
        tghpjcIntroPhoto
        tghpjcHomeEssayCategories
        tghpjcAboutTextTitle
        tghpjcAboutTextColumn2
        tghpjcAboutTextColumn1
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
    
    allWpCategory(filter: {slug: {ne: "uncategorized"}}) {
        categories: nodes {
            slug
            name
            posts {
                nodes {
                    slug
                    title
                    excerpt
                    date
                }
            }
        }
    }
}
`

export default IndexPage