import React from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import CategoryEssay from "../components/category-page-essay";

export default function ArchivePage({ data }) {
    const { name, description } = data.allWpCategory.nodes[0];
    const posts = data.allWpPost.nodes;

    return (
        <Layout>
            <div className="post-category">
                <Link to={'/'} className="post-category__back-btn">
                    Back to homepage
                </Link>
                <div className="post-category__title">
                    { name }
                </div>
                <div className="post-category__content">
                    { description }
                </div>
                <div className="post-category__posts">
                    {posts.map(post => (
                        <CategoryEssay post={post} key={post.id} />
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
                id
                slug
                name
                description
            }
        }
        
        allWpPost(filter: {categories: {nodes: {elemMatch: {id: {eq: $id}}}}}) {
            nodes {
                id
                slug
                title
                date
                excerpt
            }
        }
    }
`