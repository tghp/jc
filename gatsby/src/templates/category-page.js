import React from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import EssayLink from '../components/essay-link';
import LinkArrow from "../assets/link-arrow.svg";

export default function CategoryPage({ data }) {
    const { name, description } = data.allWpCategory.nodes[0];
    const posts = data.allWpPost.nodes;

    return (
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
                    <div className="archive-posts__posts-cat-excerpt">
                        {description}
                    </div>
                    <div className="archive-posts__posts-category post-essays">
                        {posts.map(post => (
                            <EssayLink post={post} key={post.slug} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export const query = graphql`
    query($id: String!) {
        allWpCategory(filter: { id: { eq: $id } }) {
            nodes {
                name
                description
            }
        }
        
        allWpPost(filter: {categories: {nodes: {elemMatch: {id: {eq: $id}}}}}) {
            nodes {
                slug
                title
                date
                excerpt
            }
        }
    }
`