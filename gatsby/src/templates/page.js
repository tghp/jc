import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"

export default function Page({ data }) {
    const { title, content } = data.allWpPage.nodes[0];

    return (
        <Layout>
            <div>
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </Layout>
    )
}

export const query = graphql`
    query($slug: String!) {
        allWpPage(filter: { slug: { eq: $slug } }) {
            nodes {
                title
                content
                slug
                date
            }
        }
    }
`