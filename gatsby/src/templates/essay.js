import React from "react"
import { graphql, Link } from "gatsby"
import { getPostPath, getSinglePostDateFormat } from "../model/post";
import Layout from "../components/layout"
import TableOfContentNav from "../components/table-of-content-nav"
import ImagePDFLink from "../assets/download-pdf.svg";
import ImageAudioLink from "../assets/audio-link.svg";
import ImageVideoLink from "../assets/video-link.svg";

export default function Essay({ data: { wpPost  } }) {
    const {
        title,
        content,
        slug,
        date,
        modified,
        tghpjcAudioUrl: audioUrl,
        tghpjcVideoUrl: videoUrl,
        toc
    } = wpPost;

    return (
        <Layout location={'single-post'}>
            <div className="single-essay">
                <div className="single-essay__grid">
                    <div className="single-essay__sidebar">
                        <div className="single-essay__sidebar-media-links">
                            <Link to={`/${getPostPath(slug, date)}.pdf`}><ImagePDFLink /></Link>
                            {audioUrl && <a href={audioUrl} target="_blank" rel="noreferrer" aria-label="Audio link"><ImageAudioLink /></a>}
                            {videoUrl && <a href={videoUrl} target="_blank" rel="noreferrer" aria-label="Video link"><ImageVideoLink /></a>}
                        </div>
                        <div className="single-essay__sidebar-menu">
                            <div className="single-essay__sidebar-menu-title">Contents</div>
                            {toc?.items && <TableOfContentNav hTags={toc.items}/>}
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
        wpPost(slug: {eq: $slug}) {
            title
            slug
            date
            modified
            content
            tghpjcAudioUrl
            tghpjcVideoUrl
            toc
        }
    }
`