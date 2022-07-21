import React from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import EssayLink from "../components/essay-link";
import PostArchive from "../components/post-archive";
import LinkArrow from "../assets/link-arrow.svg";

export default function ArchivePage({ data }) {
    const posts = data.allWpPost.nodes;
    const latestPosts = posts.slice(0, 6);
    const archivedPosts = posts.slice(6);

    return (
        <Layout location={'archive'}>
            <div className="archive-posts">
                <div className="archive-posts__header">
                    <div className="archive-posts__header-inner">
                        <Link to={'/'} className="archive-posts__header-back-btn">
                            <LinkArrow /> Back to homepage
                        </Link>
                        <h1 className="archive-posts__header-title">
                            All Writing
                        </h1>
                    </div>
                </div>
                <div className="archive-posts__section-1">
                    <div className="archive-posts__section-1-inner">
                        {latestPosts.map(post => (
                            <EssayLink post={post} key={post.slug} />
                        ))}
                    </div>
                </div>
                <div className="archive-posts__section-2">
                    <div className="archive-posts__section-2-inner">
                        <PostArchive posts={archivedPosts} />
                    </div>
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