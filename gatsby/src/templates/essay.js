import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import { getPostPath } from "../model/post";

export default function Essay({ data }) {
    const post = data.allWpPost.nodes[0];
    const {
        title,
        content,
        slug,
        date,
        tghpjcAudioUrl: audioUrl,
        tghpjcVideoUrl: videoUrl,
    } = post;
    const essayPath = getPostPath(slug, date);

    return (
        <Layout location={'single-post'}>
            <div className="single-essay">
                <div className="single-essay__grid">
                    <div className="single-essay__sidebar">
                        <a href={`/${essayPath}.pdf`}>PDF Here</a>
                        {audioUrl && <a href={audioUrl}>Audio Here</a>}
                        {videoUrl && <a href={videoUrl}>Video Here</a>}
                        <p>Contents</p>
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
                content
                tghpjcAudioUrl
                tghpjcVideoUrl
            }
        }
    }
`