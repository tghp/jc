import React, { useRef, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { getPostPath, getSinglePostDateFormat } from "../model/post";
import Layout from "../components/layout"
import TableOfContents from "../components/single-essay/table-of-contents"
import ImagePDFLink from "../assets/download-pdf.svg";
import ImageAudioLink from "../assets/audio-link.svg";
import ImageVideoLink from "../assets/video-link.svg";
import CommentsIcon from "../assets/comments-icon.svg";

export default function Essay({ data: { wpPost  } }) {
    const {
        title,
        content,
        slug,
        date,
        modified,
        tghpjcAudioUrl: audioUrl,
        tghpjcVideoUrl: videoUrl,
        tghpjcSubstackUrl: subtackUrl,
        tghpjcLesswrongUrl: lessWrongUrl,
        tghpjcEaforumUrl: eaForumUrl,
        toc
    } = wpPost;

    const mainContent = useRef()

    const onScroll = () => {
        const mainContentWindowTop = mainContent.current.getBoundingClientRect().top
        const sidebarTitle = document.querySelector('.single-essay__sidebar-title')
        if (mainContentWindowTop < -200) {
            sidebarTitle.classList.add('show-title')
        } else {
            sidebarTitle.classList.remove('show-title')
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <Layout location={'single-post'}>
            <div className="single-essay">
                <div className="single-essay__grid">
                    <div className="single-essay__sidebar">
                        <div className="single-essay__sidebar-title">
                            {title}
                        </div>
                        <div className="single-essay__sidebar-media-links">
                            <Link to={`/${getPostPath(slug, date)}.pdf`}><ImagePDFLink /></Link>
                            {audioUrl && <a href={audioUrl} target="_blank" rel="noreferrer" aria-label="Audio link"><ImageAudioLink /></a>}
                            {videoUrl && <a href={videoUrl} target="_blank" rel="noreferrer" aria-label="Video link"><ImageVideoLink /></a>}
                        </div>
                        <TableOfContents hTags={toc?.items} />
                    </div>
                    <div className="single-essay__header">
                        {modified && <div className="single-essay__header-update-date">Last updated: {getSinglePostDateFormat(modified)}</div>}
                        {date && <div className="single-essay__header-publish-date">Published: {getSinglePostDateFormat(date)}</div>}
                    </div>
                    <div className="single-essay__main" ref={mainContent}>
                        <h1 className="single-essay__main-title">{title}</h1>
                        <div className="single-essay__main-content" dangerouslySetInnerHTML={{ __html: content }} />
                        {subtackUrl || lessWrongUrl || eaForumUrl ?
                            <div className="single-essay__main-comments post-comments">
                                <div className="post-comments__separator">
                                    <CommentsIcon />
                                </div>
                                <div className="post-comments__options">
                                    <div className="post-comments__options-text">Leave a comment</div>
                                    <div className="post-comments__options-separator" />
                                    {subtackUrl &&
                                        <a href={subtackUrl} className="post-comments__options-system" target="_blank" rel="noreferrer">
                                            Substack
                                        </a>
                                    }
                                    {lessWrongUrl &&
                                        <a href="https://www.google.co.uk/" className="post-comments__options-system" target="_blank" rel="noreferrer">
                                            LessWrong
                                        </a>
                                    }
                                    {eaForumUrl &&
                                        <a href="https://www.google.co.uk/" className="post-comments__options-system" target="_blank" rel="noreferrer">
                                            EA Forum
                                        </a>
                                    }
                                </div>
                            </div> : ''
                        }
                        <div className="single-essay__main-further-reading">
                            <h2>Further reading</h2>

                        </div>
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
            tghpjcSubstackUrl
            tghpjcLesswrongUrl
            tghpjcEaforumUrl
            toc
        }
    }
`