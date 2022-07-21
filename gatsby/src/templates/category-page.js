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
                <div className="archive-posts__section-1">
                    <div className="archive-posts__section-1-inner">
                        {description}
                    </div>
                </div>
                <div className="archive-posts__section-2">
                    <div className="archive-posts__section-2-inner">
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