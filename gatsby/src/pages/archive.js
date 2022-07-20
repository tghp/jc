import React from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import EssayLink from "../components/essay-link";
import PostArchive from "../components/post-archive";

export default function ArchivePage({ data }) {
    const posts = data.allWpPost.nodes;
    const latestPosts = posts.slice(0, 6); // TODO: Add Pagination?

    return (
        <Layout>
            <div className="archive-posts">
                <div className="archive-posts__header">
                    <Link to={'/'} className="archive-posts__header-back-btn">
                        Back to homepage
                    </Link>
                    <div className="archive-posts__header-title">
                        All Writing
                    </div>
                </div>
                <div className="archive-posts__section-1">
                    {latestPosts.map(post => (
                        <EssayLink post={post} key={post.slug} />
                    ))}
                </div>
                <div className="archive-posts__section-2">
                    <PostArchive posts={posts} />
                </div>
            </div>
        </Layout>
    )
}

export const query = graphql`
    {
        allWpPost(sort: {fields: [date], order: DESC}) {
            nodes {
                title
                slug
                date
                excerpt
            }
        }
    }
`