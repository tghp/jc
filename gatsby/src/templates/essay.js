import React, { useState, useRef, useEffect } from "react"
import { graphql } from "gatsby"
import { useMeasure } from 'react-use';
import { HeadMeta } from "../components/meta-data-head";
import { getPostDate, getPostPath } from "../model/post";
import Layout from "../components/layout"
import TableOfContents from "../components/single-essay/table-of-contents"
import Content from "../components/single-essay/content";
import References from "../components/single-essay/references";
import ImagePDFLink from "../assets/download-pdf.svg";
import ImageAudioLink from "../assets/audio-link.svg";
import ImageVideoLink from "../assets/video-link.svg";
import CommentsIcon from "../assets/comments-icon.svg";
import EssayLink from "../components/essay-link";
import HeadingWithLink from "../components/heading-with-link";

import '../styles/essay.scss';
import 'katex/dist/katex.min.css';

export default function Essay(
    {
        data: {
            wpPost,
            furtherReadingPostsDefault,
            furtherReadingPostsOverride },
        pageContext: {
            referenceCount,
            latexCount,
            hasPdf
        }
    }
) {
    const {
        title,
        slug,
        content,
        date,
        modified,
        toc,
        seo,
        tghpjcAudioUrl: audioUrl,
        tghpjcVideoUrl: videoUrl,
        tghpjcSubstackUrl: substackUrl,
        tghpjcLesswrongUrl: lessWrongUrl,
        tghpjcEaforumUrl: eaForumUrl,
        tghpjcReferences: references,
        tghpjcPostSeriesPartNumber: partNumber,
        tghpTaxonomySeries: series,
    } = wpPost;

    const mainContent = useRef()
    const sidebarTitle = useRef()
    const referenceContentRefs = useRef({})
    const referenceSidebarRefs = useRef({})
    const [mainContentMeasureRef, { width: mainContentAreaWidth }] = useMeasure()
    const [referencesAreaMeasureRef, { width: referencesAreaWidth }] = useMeasure()
    const [referenceRowSizesDesktop, setReferenceRowSizesDesktop] = useState([]);
    const [referenceRowSizesMobile, setReferenceRowSizesMobile] = useState([]);
    const [imagesReady, setImagesReady] = useState(!content || !content.match(/<img/g));

    const onScroll = () => {
        const mainContentWindowTop = mainContent.current.getBoundingClientRect().top
        if (mainContentWindowTop < -150) {
            sidebarTitle.current.classList.add('show-title')
        } else {
            sidebarTitle.current.classList.remove('show-title')
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }
        
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (!imagesReady) {
            return;
        }

        if (Object.keys(referenceContentRefs.current).length === 0 && Object.keys(referenceSidebarRefs.current).length === 0) {
            return;
        }

        let articleReferenceListItemOffsets = 0;

        const gridRowsDesktop = Object.values(referenceContentRefs.current)
            .filter(ref => !!ref)
            .map((articleReferenceInline, i) => {
                if (!referenceSidebarRefs.current[i]) {
                    return '';
                }

                const articleReferenceListItem = referenceSidebarRefs.current[i]
                const articleReferenceListItemHeight = articleReferenceListItem.clientHeight
                const inlineReferenceOffset = Math.max(
                    20,
                    (articleReferenceInline.offsetTop - articleReferenceListItemOffsets)
                );
                articleReferenceListItemOffsets += inlineReferenceOffset + articleReferenceListItemHeight

                return `${inlineReferenceOffset}px auto`
            });

        const gridRowsMobile = gridRowsDesktop.map((prevRow, i) => i === 0 ? '0 auto' : 'var(--padding--small) auto');

        setReferenceRowSizesDesktop(gridRowsDesktop);
        setReferenceRowSizesMobile(gridRowsMobile);
    }, [referenceContentRefs, referenceSidebarRefs, mainContentAreaWidth, referencesAreaWidth, imagesReady])

    /**
     * Post Series data
     */
    const seriesName = series.nodes[0]?.name

    /**
     * Next Part in Series data
     */
    const nextSeriesPartIndex = series.nodes[0]?.posts.nodes.findIndex(item => {
        return Number(item.tghpjcPostSeriesPartNumber) === Number(partNumber)+1
    })
    const nextSeriesPartObj = series.nodes[0]?.posts.nodes[nextSeriesPartIndex]

    /**
     * Further reading data
     */
    const furtherReadingPosts = furtherReadingPostsOverride.posts.length === 0
        ? furtherReadingPostsDefault.posts
        : furtherReadingPostsOverride.posts

    return (
        <Layout location={'single-post'} seoData={seo}>
            <div className="single-essay">
                <div className="single-essay__grid">

                    <div className="single-essay__sidebar">
                        <div className="single-essay__sidebar-title" ref={sidebarTitle}>
                            {seriesName &&
                            <div>{`${seriesName} / Part ${partNumber}`}</div>
                            }
                            {title}
                        </div>
                        {hasPdf || audioUrl || videoUrl
                            ?
                            <div className="single-essay__sidebar-media-links">
                                {hasPdf && <a href={`./${slug}/pdf/`} target={`_blank`} aria-label="Download PDF"><ImagePDFLink /></a>}
                                {audioUrl && <a href={audioUrl} target={`_blank`} aria-label="Audio link"><ImageAudioLink /></a>}
                                {videoUrl && <a href={videoUrl} target={`_blank`} aria-label="Video link"><ImageVideoLink /></a>}
                            </div>
                            : null
                        }
                        <TableOfContents navItems={toc?.items} />
                    </div>

                    <div className="single-essay__header">
                        {modified && <div className="single-essay__header-update-date">Last updated: {getPostDate(modified)}</div>}
                        {date && <div className="single-essay__header-publish-date">Published: {getPostDate(date)}</div>}
                        {seriesName &&
                        <div className="single-essay__header-series">
                            <div className="single-essay__header-series-name">
                                Series
                            </div>
                            <div className="single-essay__header-series-data">
                                {`${seriesName} / Part ${partNumber}`}
                            </div>
                        </div>
                        }
                        <h1 className="single-essay__header-title">{title}</h1>
                    </div>

                    <div className="single-essay__main" ref={mainContent}>
                        <Content
                            content={content}
                            setImagesReady={setImagesReady}
                            hasReferences={!!referenceCount}
                            hasLatex={!!latexCount}
                            mainContentRef={mainContent}
                            mainContentMeasureRef={mainContentMeasureRef}
                            referenceContentRefs={referenceContentRefs}
                        />
                    </div>

                    <div className="single-essay__extra-reading">
                        {substackUrl || lessWrongUrl || eaForumUrl
                            ?
                            <div className="single-essay__extra-reading-comments post-comments">
                                <div className="post-comments__separator">
                                    <CommentsIcon />
                                </div>
                                <div className="post-comments__options">
                                    <div className="post-comments__options-text">Leave a comment</div>
                                    <div className="post-comments__options-separator" />
                                    {substackUrl &&
                                    <a href={substackUrl} className="post-comments__options-system" target="_blank" rel="noreferrer">
                                        Substack
                                    </a>
                                    }
                                    {lessWrongUrl &&
                                    <a href={lessWrongUrl} className="post-comments__options-system" target="_blank" rel="noreferrer">
                                        LessWrong
                                    </a>
                                    }
                                    {eaForumUrl &&
                                    <a href={eaForumUrl} className="post-comments__options-system" target="_blank" rel="noreferrer">
                                        EA Forum
                                    </a>
                                    }
                                </div>
                            </div>
                            : null
                        }
                        {nextSeriesPartObj &&
                        <div className="single-essay__extra-reading-next-series">
                            <HeadingWithLink
                                title="Next up"
                                titleLink={true}
                                linkText="Read next in series"
                                linkTo={getPostPath(nextSeriesPartObj.slug, nextSeriesPartObj.date)}
                                linkArrow={true}
                            />
                            <div className="single-essay__extra-reading-next-series-essay">
                                <EssayLink post={nextSeriesPartObj} />
                            </div>
                        </div>
                        }
                        {furtherReadingPosts.length !== 0 &&
                        <div className="single-essay__extra-reading-further-reading">
                            <h2>Further reading</h2>
                            {furtherReadingPosts
                                .sort((postA, postB) => new Date(postB.date) - new Date(postA.date))
                                .slice(0, 3)
                                .map(post => <EssayLink post={post} key={post.slug} /> )
                            }
                        </div>
                        }
                    </div>

                    {!!referenceCount &&
                    <References
                        references={references}
                        referenceRowSizes={[referenceRowSizesDesktop, referenceRowSizesMobile]}
                        referencesAreaMeasureRef={referencesAreaMeasureRef}
                        referenceSidebarRefs={referenceSidebarRefs}
                    />
                    }
                </div>
            </div>
        </Layout>
    )
}

export const query = graphql`
    query(
        $slug: String!, 
        $postCategories: [String!], 
        $furtherReadingPosts: [Int!]
    ) {
        wpPost(slug: {eq: $slug}) {
            title
            slug
            date
            modified
            content
            toc
            excerpt
            guid
            featuredImage {
                node {
                    sourceUrl
                }
            }
            tghpjcAudioUrl
            tghpjcVideoUrl
            tghpjcSubstackUrl
            tghpjcLesswrongUrl
            tghpjcEaforumUrl
            tghpjcPostSeriesPartNumber
            tghpTaxonomySeries {
                nodes {
                    name
                    posts {
                        nodes {
                            title
                            slug
                            date
                            excerpt
                            tghpjcPostSeriesPartNumber
                        }
                    }
                }
            }
            tghpjcReferences {
                text
            }
            ...SeoData
        } 
        
        furtherReadingPostsDefault: allWpPost(filter: {categories: {nodes: {elemMatch: {slug: {in: $postCategories}}}}}) {
            posts: nodes {
                slug
                title
                excerpt
                date
                tghpjcPostSeriesPartNumber
                tghpTaxonomySeries {
                    nodes {
                        name
                    }
                }
            }
        } 
        
        furtherReadingPostsOverride: allWpPost(filter: {databaseId: {in: $furtherReadingPosts}}) {
            posts: nodes {
                slug
                title
                excerpt
                date
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

export const Head = () => <HeadMeta />