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
    <Layout>
      <div>
        <h1>{title}</h1>
        <div>
            <a href={`/${essayPath}.pdf`}>PDF Here</a>
            {audioUrl && <a href={audioUrl}>Audio Here</a>}
            {videoUrl && <a href={videoUrl}>Video Here</a>}
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
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