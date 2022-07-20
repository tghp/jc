import React from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import EssayLink from "../components/essay-link";

export default function CategoryPage({ data }) {
    const { name, description } = data.allWpCategory.nodes[0];
    const posts = data.allWpPost.nodes;

    return (
        <Layout>
            <div className="archive-posts">
                <div className="archive-posts__header">
                    <Link to={'/'} className="archive-posts__header-back-btn">
                        Back to homepage
                    </Link>
                    <div className="archive-posts__header-title">
                        {name}
                    </div>
                </div>
                <div className="archive-posts__section-1">
                    {description}
                </div>
                <div className="archive-posts__section-2">
                    {posts.map(post => (
                        <EssayLink post={post} key={post.slug} />
                    ))}
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