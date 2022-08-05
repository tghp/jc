import React, {useEffect, useRef} from 'react'
import Layout from '../components/layout';
import { graphql, Link } from 'gatsby'
import { MetaData } from "../components/meta-data";
import EssayLink from "../components/essay-link";
import PostArchive from "../components/post-archive";
import ImageLinkArrow from "../assets/link-arrow.svg";

import '../styles/archive.scss';

export default function ArchivePage({ data }) {
    const posts = data.allWpPost.nodes;
    const latestPosts = posts.slice(0, 6);
    const archivedPosts = posts.slice(6);
    const sideBar = useRef()
    const archiveSection = useRef()

    const onScroll = () => {
        const archiveSectionWindowTop = archiveSection.current.getBoundingClientRect().top
        const mostRecentLink = sideBar.current.querySelector('.archive-posts__posts-sidebar-link:first-child')
        const archiveLink = sideBar.current.querySelector('.archive-posts__posts-sidebar-link:last-child')

        if (archiveSectionWindowTop <= 1) {
            mostRecentLink.classList.remove('link-active')
            archiveLink.classList.add('link-active')
        } else {
            mostRecentLink.classList.add('link-active')
            archiveLink.classList.remove('link-active')
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <>
            <MetaData title={`Archive`} />
            <Layout location={'archive'}>
                <div className="archive-posts">
                    <div className="archive-posts__header">
                        <div className="archive-posts__header-inner">
                            <Link to={'/'} className="archive-posts__header-back-btn">
                                <ImageLinkArrow /> Back to homepage
                            </Link>
                            <h1 className="archive-posts__header-title">
                                All Writing
                            </h1>
                        </div>
                    </div>
                    <div className="archive-posts__posts">
                        <div className="archive-posts__posts-sidebar" ref={sideBar}>
                            <Link to={'#most-recent-posts'} className="archive-posts__posts-sidebar-link link-active">
                                Most recent
                            </Link>
                            <Link to={'#archived-posts'} className="archive-posts__posts-sidebar-link">
                                Archive
                            </Link>
                        </div>
                        <div className="archive-posts__posts-latest" id="most-recent-posts">
                            {latestPosts.map(post => (
                                <EssayLink post={post} key={post.slug} />
                            ))}
                        </div>
                        <div className="archive-posts__posts-archive" id="archived-posts" ref={archiveSection}>
                            <PostArchive posts={archivedPosts} />
                        </div>
                    </div>
                </div>
            </Layout>
        </>
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
                tghpjcPostSeriesPartNumber
                tghpTaxonomySeries {
                    nodes {
                        name
                    }
                }
            }
        }
    }
`