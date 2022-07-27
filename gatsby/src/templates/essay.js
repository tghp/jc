import React from "react"
import Layout from "../components/layout"
import { graphql, Link } from "gatsby"
import { getPostPath, getSinglePostDateFormat } from "../model/post";
import ImagePDFLink from "../assets/download-pdf.svg";
import ImageAudioLink from "../assets/audio-link.svg";
import ImageVideoLink from "../assets/video-link.svg";

export default function Essay({ data }) {
    const post = data.allWpPost.nodes[0];
    const {
        title,
        content,
        slug,
        date,
        modified,
        tghpjcAudioUrl: audioUrl,
        tghpjcVideoUrl: videoUrl,
    } = post;

    return (
        <Layout location={'single-post'}>
            <div className="single-essay">
                <div className="single-essay__grid">
                    <div className="single-essay__sidebar">
                        <div className="single-essay__sidebar-media-links">
                            <Link to={`/${getPostPath(slug, date)}.pdf`}><ImagePDFLink /></Link>
                            {audioUrl && <Link to={audioUrl}><ImageAudioLink /></Link>}
                            {videoUrl && <Link to={videoUrl}><ImageVideoLink /></Link>}
                        </div>
                        <div className="single-essay__sidebar-menu">
                            <div className="single-essay__sidebar-menu-title">Contents</div>
                            <ul className="single-essay__sidebar-menu-nav">
                                <li>Introduction</li>
                                <li>The mechanistic method</li>
                                <li>The functional method</li>
                            </ul>
                        </div>
                    </div>
                    <div className="single-essay__header">
                        {modified && <div className="single-essay__header-update-date">Last updated: {getSinglePostDateFormat(modified)}</div>}
                        {date && <div className="single-essay__header-publish-date">Published: {getSinglePostDateFormat(date)}</div>}
                    </div>
                    <div className="single-essay__main">
                        <h1 className="single-essay__main-title">{title}</h1>
                        <div className="single-essay__main-content" dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export const query = graphql`
    query($slug: String!) {
        allWpPost(filter: { slug: { eq: $slug } }) {
            nodes {
                title
                slug
                date
                modified
                content
                tghpjcAudioUrl
                tghpjcVideoUrl
            }
        }
    }
`