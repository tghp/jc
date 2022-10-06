import React from 'react'
import { graphql, Link } from 'gatsby'
import { HeadMeta } from "../components/meta-data-head";
import { MetaData } from "../components/meta-data";
import Layout from '../components/layout';
import EssayLink from '../components/essay-link';
import LinkArrow from "../assets/link-arrow.svg";

export default function CategoryPage({ data }) {
    const {
        name,
        tghpjcCategoryContent: content
    } = data.wpCategory;
    const posts = data.allWpPost.nodes;

    return (
        <>
            <MetaData title={name} />
            <Layout location={'category'}>
                <div className="archive-posts">
                    <div className="archive-posts__header">
                        <div className="archive-posts__header-inner">
                            <Link to={'/'} className="archive-posts__header-back-btn">
                                <LinkArrow /> Back to homepage
                            </Link>
                            <h1 className="archive-posts__header-title">
                                {name}
                            </h1>
                        </div>
                    </div>
                    <div className="archive-posts__posts">
                        <div className="archive-posts__posts-sidebar">

                        </div>
                        {content &&
                            <div className="archive-posts__posts-cat-excerpt" dangerouslySetInnerHTML={{ __html: content }} />
                        }
                        <div className="archive-posts__posts-category post-essays">
                            {posts.map(post => (
                                <EssayLink post={post} key={post.slug} />
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export const query = graphql`
    query($id: String!) {
        wpCategory(id: {eq: $id}) {
            name
            tghpjcCategoryContent
        }
        
        allWpPost(
            filter: {categories: {nodes: {elemMatch: {id: {eq: $id}}}}}, 
            sort: {fields: [date], order: DESC}
        ) {
            nodes {
                slug
                title
                date
                excerpt
                tghpjcPostSeriesPartNumber
                tghpjcExternalUrl
                tghpTaxonomySeries {
                    nodes {
                        name
                    }
                }
            }
        }
    }
`

export const Head = () => <HeadMeta />